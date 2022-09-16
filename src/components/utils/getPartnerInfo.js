const getPartnerInfo = (participents, email) => {
  return participents.find((participent) => participent.email !== email);
};

export default getPartnerInfo;
