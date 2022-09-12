
import { Factory } from 'rosie'; 

const UserFactory = new Factory()
  .sequence('id')
  .attr('name', ['id'], function(i) { return 'user' + i; })
  .attr('email', ['id'], function(i) { return 'user' + i + '@example.com'; })
  .attr('password', 'password')
  .attr('role', 'user')

export default UserFactory;
