// This is a naive implementation of a Dialogflow's fulfillment answer.
exports.convertFormat = (data) => {
  return {
    fulfillmentText: `Hi ! Here's every student in my class: ${data.map((el) => el[0]).join(', ')}`
  };
};

exports.confirmName = (data) => {
  return {
    fulfillmentText: `Hi! Is this your name: ${data[0]}`
  };
};

exports.showBalance = (data) => {
  return {
    fulfillmentText: `You have ${data[2]} remaining in your dental allowance. \n 
    ${data[3]} worth of dental claims is currently under processing. \n\n
    If you would like to continue with your dental claims, please upload your receipt. (Say yes for now).`
  };
};

// TODO: specify that the update is really successful
exports.confirmComplete = (data) => {
  return {
    fulfillmentText: `Your form is now being processed.`
  };
};