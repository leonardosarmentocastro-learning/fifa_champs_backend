const SHARED_CONSTANTS = require('./src/modules/shared/constants');
const { Webserver } = require('./src/webserver');

(async () => {
  try {
    new Webserver().start();

    // const model = require('./src/modules/users/model');
    // await model.remove();

    // const user = new model({
    //   slack: {
    //     displayName: '@gil'
    //   },
    // });
    // await user.save();

    // const users = await model.find();
    // console.log('### users', JSON.stringify(users, null, 2));

    } catch(error) {
      console.error(error);
    }
})();
