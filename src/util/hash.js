import md5 from 'crypto-js/md5';

const hash = myPlaintextPassword => {
    return md5(myPlaintextPassword).toString();
}

export default hash