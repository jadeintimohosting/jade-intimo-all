import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { addresses } from '#models/adress.model.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(`hashPassword bcrypt error: ${error.message}`, error);
    throw new Error('error hashing the password');
  }
};

export const createUser = async ({
  first_name,
  last_name,
  email,
  password,
  phone,
  role = 'user',
}) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      logger.warn(`createUser: attempt to register existing email ${email}`);
      throw new Error('user already exists');
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        first_name,
        last_name,
        email,
        password: passwordHash,
        phone,
        role,
      })
      .returning({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        phone: users.phone,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User created: ${newUser.email} (id=${newUser.id}, role=${newUser.role})`);
    return newUser;
  } catch (error) {
    if (error.message !== 'user already exists') {
      logger.error(`createUser error for email ${email}: ${error.message}`, error);
    }
    throw error;
  }
};

export const findUserByEmail = async email => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user[0];
  } catch (error) {
    logger.error(`findUserByEmail error (email=${email}): ${error.message}`, error);
    throw error;
  }
};

export const verifyPassword = async (plain, hash) => {
  try {
    return await bcrypt.compare(plain, hash);
  } catch (error) {
    logger.error(`verifyPassword bcrypt error: ${error.message}`, error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        phone: users.phone,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    return updated;
  } catch (error) {
    logger.error(`updateUser error (id=${id}, fields=${Object.keys(data || {}).join(',')}): ${error.message}`, error);
    throw error;
  }
};

export const createAdress=async ({
  user_id,
  address_line,
  city,
  state,
  postal_code,
  country
})=>{

  try {
    const existingAddress=await db
      .select()
      .from(addresses)
      .where(eq(addresses.user_id,user_id))
      .limit(1)

    if(existingAddress.length>0) {
      logger.warn(`createAdress: user ${user_id} already has an address`);
      throw new Error("User already registered an address")
    }

    const [newAddress]=await db
      .insert(addresses)
      .values({
        user_id,
        address_line,
        city,
        state,
        postal_code,
        country
      })
      .returning({
        id:addresses.id,
        user_id:addresses.user_id,
        address_line:addresses.address_line,
        city:addresses.city,
        state:addresses.state,
        postal_code:addresses.postal_code,
        country:addresses.country,
        created_at:addresses.created_at
      })
    logger.info(`Address ${newAddress.id} created for user ${user_id}`)
    return newAddress
  } catch (error) {
    if (error.message !== 'User already registered an address') {
      logger.error(`createAdress error (user=${user_id}): ${error.message}`, error);
    }
    throw error;
  }

}

export const updatAdress = async (userId, data) => {
  try {
    const [updated] = await db
      .update(addresses)
      .set(data)
      .where(eq(addresses.user_id, userId))
      .returning({
        id: addresses.id,
        user_id: addresses.user_id,
        address_line: addresses.address_line,
        city: addresses.city,
        state: addresses.state,
        postal_code: addresses.postal_code,
        country: addresses.country
      })

    return updated
  } catch (error) {
    logger.error(`updatAdress error (user=${userId}, fields=${Object.keys(data || {}).join(',')}): ${error.message}`, error)
    throw error
  }
}
