import logger from '#config/logger.js';
import {
  createUser,
  findUserByEmail,
  verifyPassword,
  updateUser,
  createAdress,
  updatAdress,
} from '#services/auth.service.js';
import {
  signupScheema,
  loginScheema,
  updateUserSchema,
  addAddress,
  updateAddress,
} from '#validations/auth.validation.js';
import { jwttoken } from '#utils/jwt.js';
import { formatValidationError } from '#utils/format.js';
import { cookies } from '#utils/cookies.js';
import { db } from '#config/database.js';
import { addresses } from '#models/adress.model.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '#services/email.service.js';
import { welcomeEmail } from '#utils/emails/welcome.js';

export const signupController = async (req, res) => {
  const email = req.body?.email;
  try {
    const validationResult = signupScheema.safeParse(req.body);

    if (!validationResult.success) {
      logger.warn(`Signup validation failed for email ${email}: ${JSON.stringify(formatValidationError(validationResult.error))}`);
      return res.status(400).json({
        error: 'Inregistrare esuata',
        message: 'Înregistrare eșuată',
        details: formatValidationError(validationResult.error),
      });
    }

    const { first_name, last_name, email: validEmail, password, role, phone } =
      validationResult.data;

    const user = await createUser({
      first_name,
      last_name,
      email: validEmail,
      password,
      phone,
      role,
    });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    });

    cookies.set(res, 'token', token);

    const fullName = user.first_name + " " + user.last_name;
    sendEmail({ to: user.email, subject: "Bine ai venit in cont", text: "Bine ai venit in cont!", html: welcomeEmail(user.email, fullName, user.phone, user.first_name, user.last_name) })

    logger.info(`User registered successfully: ${validEmail} (id=${user.id})`);
    res.status(201).json({
      message: 'user registered',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.message === 'user already exists') {
      logger.warn(`Signup attempt for already-registered email: ${email}`);
      return res.status(409).json({ error: 'Email already registered', message: 'Există deja un cont cu acest email' });
    }
    logger.error(`Signup error for email ${email}: ${error.message}`, error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const loginController = async (req, res) => {
  const email = req.body?.email;
  try {
    const validationResult = loginScheema.safeParse(req.body);

    if (!validationResult.success) {
      logger.warn(`Login validation failed for email ${email}`);
      return res.status(400).json({
        error: 'Logare esuata',
        message: 'Autentificare eșuată',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email: validEmail, password } = validationResult.data;

    const user = await findUserByEmail(validEmail);

    if (!user) {
      logger.warn(`Login attempt for non-existent email: ${validEmail}`);
      return res.status(401).json({ error: 'Invalid credentials', message: 'Date de autentificare invalide' });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      logger.warn(`Failed login attempt (bad password) for email: ${validEmail}`);
      return res.status(401).json({ error: 'Invalid credentials', message: 'Date de autentificare invalide' });
    }

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    });

    cookies.set(res, 'token', token);

    logger.info(`User logged in: ${validEmail} (id=${user.id})`);
    return res.status(200).json({
      message: 'logged in',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Login error for email ${email}: ${error.message}`, error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const logoutController = (req, res) => {
  try {
    cookies.clear(res, 'token');
    logger.info(`User signed out: ${req.user?.email || 'unknown'}`);
    return res.status(200).json({ message: 'logged out' });
  } catch (error) {
    logger.error(`Logout error for user ${req.user?.email || 'unknown'}: ${error.message}`, error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const updateDataController = async (req, res) => {
  let userId = null;
  try {
    const token = cookies.get(req, 'token');

    let payload;
    try {
      payload = jwttoken.verify(token);
      userId = payload.id;
    } catch (jwtError) {
      logger.warn(`updateDataController: invalid/expired token: ${jwtError.message}`);
      return res.status(401).json({ error: 'Authentication failed', message: 'Token invalid sau expirat' });
    }

    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      logger.warn(`updateDataController validation failed for user ${userId}`);
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Validare eșuată',
        details: formatValidationError(validation.error),
      });
    }

    const data = { ...validation.data };

    const updated = await updateUser(userId, data);

    if (!updated) {
      logger.warn(`updateDataController: user ${userId} not found`);
      return res.status(404).json({ error: 'User not found', message: 'Utilizatorul nu a fost găsit' });
    }

    logger.info(`User ${userId} data updated`);
    return res.status(200).json({ message: 'user updated', user: updated });
  } catch (error) {
    logger.error(`Update data error for user ${userId}: ${error.message}`, error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};


export const addAddressController = async (req, res) => {
  let user_id = null;
  try {
    const validationResult = addAddress.safeParse(req.body)
    if (!validationResult.success) {
      logger.warn('addAddressController validation failed');
      return res.status(400).json({
        error: 'Adaugarea Adresei esuata',
        message: 'Adăugarea adresei a eșuat',
        details: formatValidationError(validationResult.error),
      });
    }

    const { address_line, city, state, postal_code, country } = validationResult.data

    const token = cookies.get(req, 'token');

    let payload;
    try {
      payload = jwttoken.verify(token);
      user_id = payload.id;
    } catch (jwtError) {
      logger.warn(`addAddressController: invalid/expired token: ${jwtError.message}`);
      return res.status(401).json({ error: 'Authentication failed', message: 'Token invalid sau expirat' });
    }

    const address = await createAdress({
      user_id,
      address_line,
      city,
      state,
      postal_code,
      country
    })

    logger.info(`Address ${address.id} created for user ${user_id}`);

    res.status(201).json({
      message: "address created",
      address: {
        id: address.id,
        user_id: address.user_id,
        address_line: address.address_line,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        created_at: address.created_at
      }
    })
  }
  catch (error) {
    if (error.message === 'User already registered an address') {
      logger.warn(`addAddressController: user ${user_id} already has an address`);
      return res.status(409).json({ error: 'Address already exists', message: 'Utilizatorul are deja o adresă înregistrată' });
    }
    logger.error(`addAddressController error for user ${user_id}: ${error.message}`, error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
}

export const updateAddressController = async (req, res) => {
  let user_id = null;
  try {
    const validationResult = updateAddress.safeParse(req.body);

    if (!validationResult.success) {
      logger.warn('updateAddressController validation failed');
      return res.status(400).json({
        error: 'Actualizarea adresei esuata',
        message: 'Actualizarea adresei a eșuat',
        details: formatValidationError(validationResult.error),
      });
    }

    const data = { ...validationResult.data };

    const token = cookies.get(req, 'token');

    let payload;
    try {
      payload = jwttoken.verify(token);
      user_id = payload.id;
    } catch (jwtError) {
      logger.warn(`updateAddressController: invalid/expired token: ${jwtError.message}`);
      return res.status(401).json({ error: 'Authentication failed', message: 'Token invalid sau expirat' });
    }

    const address = await updatAdress(user_id, data);

    if (!address) {
      logger.warn(`updateAddressController: no address found for user ${user_id}`);
      return res.status(404).json({ error: 'Address not found', message: 'Adresa nu a fost găsită' });
    }

    logger.info(`Address ${address.id} updated for user ${user_id}`);

    return res.status(200).json({
      message: 'address updated',
      address: {
        id: address.id,
        user_id: address.user_id,
        address_line: address.address_line,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
      },
    });
  } catch (error) {
    logger.error(`updateAddressController error for user ${user_id}: ${error.message}`, error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const getAddressController = async (req, res) => {
  const user_id = req.user?.id;
  try {
    if (!user_id) {
      logger.warn('getAddressController called without authenticated user');
      return res.status(401).json({ error: 'Unauthorized', message: 'Acces neautorizat' });
    }

    const result = await db
      .select()
      .from(addresses)
      .where(eq(addresses.user_id, user_id))
      .limit(1);

    const address = result[0];

    if (!address) {
      return res.status(200).json({ address: null });
    }

    return res.status(200).json({
      address: {
        id: address.id,
        user_id: address.user_id,
        address_line: address.address_line,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        created_at: address.created_at,
      },
    });
  } catch (error) {
    logger.error(`getAddressController error for user ${user_id}: ${error.message}`, error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};