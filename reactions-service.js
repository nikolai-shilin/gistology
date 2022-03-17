module.exports = {
  /**
   *
   */
  validateReaction: function (reaction) {
    const VALID_REACTIONS = ["💗", "👌", "🤩", "✅", "🧠", "👶"];
    if (VALID_REACTIONS.includes(reaction)) {
      return true;
    } else {
      throw new Error(`Invalid reaction string ${reaction}`);
    }
  },

  /**
   *
   */
  getUpdatedReactionsWithUserReaction: function (
    worksheetReactions,
    userReaction,
    user
  ) {
    // check if a reactions array if defined
    if (!Array.isArray(worksheetReactions)) {
      worksheetReactions = [];
    } else {
      WorksheetService.removeUserReaction(worksheetReactions, user.id);
    }

    let reactionObject = WorksheetService.getReactionObject(user, userReaction);
    worksheetReactions.push(reactionObject);
    return worksheetReactions;
  },

  /**
   * returns reaction object composed of user data, date, reaction string
   */
  removeUserReaction: function (worksheetReactions, userId) {
    let userReactionIndex = WorksheetService.getUserReactionIndex(
      worksheetReactions,
      userId
    );
    // remove existing user reaction
    if (userReactionIndex > -1) {
      worksheetReactions.splice(userReactionIndex, 1);
    }
    return worksheetReactions;
  },

  /**
   * returns reaction object composed of user data, date, reaction string
   */
  getReactionObject: function (user, userReaction) {
    return {
      reaction: userReaction,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imagePath: user.imagePath,
      date: Date.now(),
    };
  },

  /**
   *
   */
  getUserReactionIndex: function (reactions, userId) {
    return reactions.findIndex((reaction) => reaction.userId === userId);
  },

  /**
   *
   */
  getWorksheetReactionsCount: function (worksheet) {
    return worksheet && worksheet.reactions
      ? worksheet.reactions.reduce(
          (reactionsMap, reaction) => ({
            ...reactionsMap,
            ...(reactionsMap[reaction.reaction]
              ? { [reaction.reaction]: reactionsMap[reaction.reaction] + 1 }
              : { [reaction.reaction]: 1 }),
          }),
          {}
        )
      : {};
  },

  /**
   *
   */
  getUserWorksheetReactions: function (user, worksheet) {
    return user && user.id && worksheet && worksheet.reactions
      ? worksheet.reactions
          .filter((reaction) => reaction.userId === user.id)
          .map((reaction) => reaction.reaction)
      : [];
  },
};
