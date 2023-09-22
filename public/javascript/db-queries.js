import db from './database.js';

export const getAllTest = () => {
    return db.any('SELECT * FROM auth.users');
};
