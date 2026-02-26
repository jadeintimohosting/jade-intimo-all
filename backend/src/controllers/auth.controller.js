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
  try {
    const validationResult = signupScheema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Inregistrare esuata',
        message: 'Înregistrare eșuată',
        details: formatValidationError(validationResult.error),
      });
    }

    const { first_name, last_name, email, password, role, phone } =
      validationResult.data;

    const user = await createUser({
      first_name,
      last_name,
      email,
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

    const fullName=user.first_name+" "+user.last_name;
    sendEmail({to:user.email,subject:"Bine ai venit in cont",text:"Bine ai venit in cont!",html:welcomeEmail(user.email,fullName,user.phone,user.first_name,user.last_name)})

    logger.info('user registered successfully:', email);
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
    logger.error('Signup error', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const loginController = async (req, res) => {
  try {
    const validationResult = loginScheema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Logare esuata',
        message: 'Autentificare eșuată',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await findUserByEmail(email);

    if (!user) return res.status(401).json({ error: 'Invalid credentials', message: 'Date de autentificare invalide' });

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) return res.status(401).json({ error: 'Invalid credentials', message: 'Date de autentificare invalide' });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    });

    cookies.set(res, 'token', token);

    logger.info('user logged in:', email);
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
    logger.error('Login error', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const logoutController = (req, res) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out successfully');
    return res.status(200).json({ message: 'logged out' });
  } catch (error) {
    logger.error('Logout error', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const updateDataController = async (req, res) => {
  try {
    const token = cookies.get(req, 'token');
    const payload = jwttoken.verify(token);

    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Validare eșuată',
        details: formatValidationError(validation.error),
      });
    }

    const data = { ...validation.data };

    const updated = await updateUser(payload.id, data);
    return res.status(200).json({ message: 'user updated', user: updated });
  } catch (error) {
    logger.error('Update error', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};


export const addAddressController = async (req,res)=>{
  try {
    const validationResult=addAddress.safeParse(req.body)
    if(!validationResult.success){
      return res.status(400).json({
        error: 'Adaugarea Adresei esuata',
        message: 'Adăugarea adresei a eșuat',
        details: formatValidationError(validationResult.error),
      });
    }

    const {address_line,city,state,postal_code,country}=validationResult.data

    const token = cookies.get(req, 'token');
    const payload = jwttoken.verify(token);

    const user_id = payload.id;

    const address=await createAdress({
      user_id,
      address_line,
      city,
      state,
      postal_code,
      country
    })

    res.status(201).json({
      message:"address created",
      address:{
        id:address.id,
        user_id:address.user_id,
        address_line:address.address_line,
        city:address.city,
        state:address.state,
        postal_code:address.postal_code,
        country:address.country,
        created_at:address.created_at
      }
    })
  }
  catch (error) {
    logger.error('address create error', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
}

export const updateAddressController=async (req,res)=>{
  try {
    const validationResult = updateAddress.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Actualizarea adresei esuata',
        message: 'Actualizarea adresei a eșuat',
        details: formatValidationError(validationResult.error),
      });
    }

    const data = { ...validationResult.data };

    const token = cookies.get(req, 'token');
    const payload = jwttoken.verify(token);

    const user_id = payload.id;

    const address = await updatAdress(user_id, data);

    if (!address) {
      return res.status(404).json({ error: 'Address not found', message: 'Adresa nu a fost găsită' });
    }

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
    logger.error('address update error', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};

export const getAddressController = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;

    if (!user_id) {
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
    logger.error('get address error', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
  }
};