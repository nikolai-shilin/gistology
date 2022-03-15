const worksheetsMock = [
  {
    id: 1,
    reactions: [
      { userId: 6471254, reaction: "💗" },
      { userId: 7134896, reaction: "👌" },
      { userId: 7188825, reaction: "🤩" },
      { userId: 7188825, reaction: "✅" },
      { userId: 6471254, reaction: "🤩" },
      { userId: 6383798, reaction: "🧠" },
      { userId: 3375102, reaction: "🧠" },
      { userId: 3375102, reaction: "👌" },
      { userId: 3375102, reaction: "🤩" },
    ],
  },
  {
    id: 2,
    reactions: [{ userId: 6471254, reaction: "💗" }],
  },
  {
    id: 3,
    reactions: null,
  },
  {
    id: 4,
    reactions: [],
  },
  {
    id: 5,
    reactions: [
      { userId: 3375102, reaction: "🧠" },
      { userId: 3375102, reaction: "👌" },
      { userId: 3375102, reaction: "🤩" },
    ],
  },
];


/**
 * get user by id from db
 */
async function getUserFromDB(userId) {
  // mock
  return Promise.resolve({
    id: userId,
    imagePath: `http://s3.smth.com/image-${userId}.url`,
    firstName: "Alan",
    lastName: "Gate",
  });
  // not mock
  // return await knex
  //   .select("id", "first_name,", "last_name", "image_path")
  //   .from("us_user");
}

/**
 * get list of worksheets where reactions has been set
 */
async function getWorksheetsWithNonNullReactionsFromDB() {
  // mock
  return Promise.resolve(worksheetsMock);
  // not mock
  // return await knex
  //   .select("id", "reactions")
  //   .from("ws_wroksheet")
  //   .havingNotNull("reactions");
}

/**
 * update worksheet reactions by workshhet id
 */
async function updateWorksheetReactionsInDB(worksheet) {
  // mock
  return Promise.resolve({ success: true });
  // not mock
  // return await knex("ws_worksheet")
  //   .update({ reactions: worksheet.reactions })
  //   .where({ id: worksheet.id });
}

/**
 * returns the list of the last reactions for every user
 * with reaction order preservation
 */
function getUniqueUserReactions(reactions) {
  let usedUserIds = {};
  return reactions
    .reverse()
    .filter((reaction) => {
      let isUsed = !(reaction.userId in usedUserIds);
      usedUserIds[reaction.userId] = true;
      return isUsed;
    })
    .reverse();
}

/**
 * enhance previos reaction records with additional data from user
 */
async function enhanceReactionsWithUserData(reactions) {
  for await (let reaction of reactions) {
    let user = await getUserFromDB(reaction.userId);
    reaction = enhanceReactionData(reaction, user);
  }
  return reactions;
}

/**
 * enhance previos reaction record with additional data from user
 */
function enhanceReactionData(reaction, user) {
  let { imagePath, firstName, lastName } = user;
  return Object.assign(reaction, {
    imagePath,
    firstName,
    lastName,
    date: Date.now()
  });
}

/**
 * cases when we dont need a migration of reactions list
 */
function isMigrationRequired(worksheet) {
    let reactions = worksheet.reactions;
    //  null case
    if (reactions === null) {
      return false;
    }
    // empty list case
    if (Array.isArray(reactions) && !reactions.length) {
      return false;
    }
    return true;
  }


/**
 * main
 */
getWorksheetsWithNonNullReactionsFromDB()
  .then(async (worksheets) => {
    for await (let worksheet of worksheets) {
      if (isMigrationRequired(worksheet)) {
        let uniqueReactions = getUniqueUserReactions(worksheet.reactions);
        worksheet.reactions = await enhanceReactionsWithUserData(
          uniqueReactions
        );
        await updateWorksheetReactionsInDB(worksheet);
      }
    }
    console.log(JSON.stringify(worksheets));
  })
  .catch((err) => {
    console.log(err);
  });

