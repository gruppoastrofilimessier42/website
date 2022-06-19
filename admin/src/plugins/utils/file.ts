export default function () {
  function getFilenameFromResponse(blobResponse: any, defaultFilename?: string) {
    return (
      blobResponse?.headers?.["content-disposition"]?.split(";")[1]?.split("=")[1]?.replace(/"/g, "") || defaultFilename
    );
  }

  function downloadItem(response: any, fileName?: string) {
    const link = document.createElement("a");
    const { data } = response;
    link.href = URL.createObjectURL(data);

    link.download = getFilenameFromResponse(response, fileName);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return {
    getFilenameFromResponse,
    downloadItem,
  };
}
