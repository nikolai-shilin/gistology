
const getUsedDiffRules = async (worksheet, userId) => {
  if (!worksheet || !userId) {
    throw Error('Not passed correct argumets to getUsedDiffRules');
  }

  const userAttributes = await LearnerService.getAttributeAutocomplete(userId);
  const userGroups = await LearnerGroupService.getGroups(userId);

  const worksheetWidgetGroups = getWorksheetWidgetGroups(worksheet);
  const userAttributesMap = mapAttributesArrayToObject(userAttributes);

  return getFilterData(userGroups, worksheetWidgetGroups, userAttributesMap);
};


const getFilterData = (userGroups, worksheetWidgetGroups, userAttributesMap) => {
  const filtersData = [];
  userGroups
    .filter((group) => worksheetWidgetGroups.includes(group.id))
    .forEach((group) => {
      group.filters && group.filters
        .forEach((filter) => {
          filtersData.push(composeFilterDataObject(filter, userAttributesMap));
        });
    });
  return filtersData;
}

const mapAttributesArrayToObject = (attributesArray) => {
  const attrMap = {};
  attributesArray.forEach((attr) => {
    attrMap[attr.id] = attr;
  });
  return attrMap;
}


const getWorksheetWidgetGroups = (worksheet) => {
  const groups = worksheet.widgets
    .filter((w) => w.isDifferentiated && w.groups && w.groups.length)
    .flatMap((w) => w.groups);
  return [...new Set(groups)];
};


const composeFilterDataObject = (filter, userAttributes) => ({
  type: userAttributes[filter.attr] ? userAttributes[filter.attr] : null,
  filter: filter,
});

