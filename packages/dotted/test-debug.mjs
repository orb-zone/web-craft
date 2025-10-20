import { getProperty as dotGet } from 'dot-prop';

const data = {
  firstName: 'John',
  lastName: 'Doe',
  '.fullName': '${firstName} ${lastName}',
};

console.log("Get '.fullName':", dotGet(data, '.fullName'));
console.log("Get 'fullName':", dotGet(data, 'fullName'));
console.log("Keys:", Object.keys(data));
