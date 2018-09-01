const SHARED_CONSTANTS = require('./src/modules/shared/constants');
const { Webserver } = require('./src/webserver');

(async () => {
  try {
    new Webserver().start();

    const { authenticationService } = require('./src/modules/authentication');
    const { usersService } = require('./src/modules/users');
    const model = require('./src/modules/users/model');
    await model.remove();

    // const user = new model({
    //   slack: {
    //     displayName: '@gil'
    //   },
    //   privateFields: {
    //     password: 'abc'
    //   }
    // });
    // await user.save();
    const user = {
      slack: {
        displayName: '@leonardo.caxumba'
      },
      password: '1q2w#E$R'
    };
    const savedUser = await usersService.signUp(user);

    const encryptedValue = savedUser.privateFields.password;
    const unencryptedValue = user.password;
    const doesEncryptedAndUnencryptedValuesMatch = await authenticationService.doesEncryptedAndUnencryptedValuesMatch(encryptedValue, unencryptedValue);
    console.log('#### doesEncryptedAndUnencryptedValuesMatch', doesEncryptedAndUnencryptedValuesMatch); // TODO: FIX IT
    const users = await model.find();
    console.log('### users', JSON.stringify(users, null, 2));

    } catch(error) {
      console.error(error);
    }
})();
