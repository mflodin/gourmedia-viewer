import type { Page, Response } from "playwright-core";

export function interceptMenuItems(page: Page, year: number, weekNumber: number): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timeout waiting for menu data"));
    }, 30000); // 30 second timeout

    page.on("response", async (res: Response) => {
      try {
        if (res.url().includes("_api") && res.url().includes("query")) {
          try {
            const body = await res.json();
            const dataItems = body.dataItems;

            if (dataItems && Array.isArray(dataItems)) {
              dataItems.forEach((item: any) => {
                if (
                  item?.dataCollectionId === "Meny" &&
                  item?.data?.restrauntId === "Restaurang Gourmedia" &&
                  item?.data?.year === year &&
                  item?.data?.weekNumber === weekNumber
                ) {
                  // Clear timeout and resolve when we get the data
                  clearTimeout(timeout);
                  resolve(item.data.menuSwedish);
                }
              });
            }
          } catch (jsonError) {
            console.error("Error parsing JSON from API response:", jsonError);
          }
        }
      } catch (responseError) {
        console.error("Error in response listener:", responseError);
      }
    });
  });
}
