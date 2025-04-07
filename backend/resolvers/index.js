const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
  Query: {
    employees: async () => {
      return await Employee.find();
    },
    employee: async (_, { id }) => {
      return await Employee.findById(id);
    }
  },

  Mutation: {
    signup: async (_, { name, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      return await user.save();
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { token, user };
    },

    addEmployee: async (_, args, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const employee = new Employee(args);
      return await employee.save();
    },

    updateEmployee: async (_, { id, ...rest }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      return await Employee.findByIdAndUpdate(id, rest, { new: true });
    },

    deleteEmployee: async (_, { id }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      await Employee.findByIdAndDelete(id);
      return true;
    }
  }
};

module.exports = resolvers;
