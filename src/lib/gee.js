function getTileUrl(mapId, token) {
  let baseUrl = "https://earthengine.googleapis.com/map";
  let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/");
  url += "?token=" + token;
  return url;
}

export {
  getTileUrl
}
