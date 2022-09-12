import mongoose from 'mongoose';
import config from './environment';

module.exports = {
    mongoose,
    connect: () => {
        mongoose.Promise = Promise;
        mongoose.connect(config.database[process.env.NODE_ENV]);
    },
    disconnect: (done) => {
        mongoose.disconnect(done);
    },
};