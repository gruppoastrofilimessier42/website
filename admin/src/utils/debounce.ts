export default async function debounce(fun: Function, delay: number = 100) {
  const funObject = fun as any;
  if(funObject.fetchItemsAborter) {
    funObject.fetchItemsAborter();
    funObject.fetchItemsAborter = null;
  }
  try {
    const p = new Promise((resolve, reject) => {
      funObject.fetchItemsAborter = reject;
      setTimeout(resolve, delay);
    });
    await p;
    return true;
  } catch {
    return false;
  }
}
