
export const UsedCarsPageLocators = {
  usedCarsNavLink: 'span[class="c-p"]',
  usedCarsSubNavLink: 'a[data-track-label="nav-used-car"]',
  cityDropdownTitle: (cityName: string) => `title=${cityName}`, // Function typed with string param
  popularModelList: 'ul[class="zw-sr-secLev usedCarMakeModelList popularModels ml-20 mt-10"]',
// popularModelList:'.gsc_thin_scroll ul[class*="zw-sr-secLev"]',
  scrollLocatorXPath: '//div[@class="zw-sr-shortWrap pt-15"]/div[@class="gsc_thin_scroll"]',
// scrollLocatorXPath:'.gsc_thin_scroll',
  usedCarsHeaderXPath: '//h1[@id="usedcarttlID"]',
// usedCarsHeaderXPath:'#usedcarttlID'
};
