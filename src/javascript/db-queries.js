import db from './postgres_database.js';

db.connect()
    .then(obj => {
        obj.done();  // Close the connection
        console.log('Connected to the database');
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

export const getAllTest = () => {
    return db.any('SELECT * FROM auth.users');
};


db.close()