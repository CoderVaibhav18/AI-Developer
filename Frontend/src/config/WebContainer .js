import { WebContainer } from "@webcontainer/api";

let webContainerInstance = null;

const getWebContainer = async () => {
  if (webContainerInstance === null) {
    webContainerInstance = await WebContainer.boot();
  }
  return webContainerInstance;
};
export { getWebContainer };
