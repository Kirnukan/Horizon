const BASE_URL = 'http://localhost:8000';
// const BASE_URL = 'https://www.horizon.uniorone.ru';
const CHECK_URL = 'http://localhost:8000/check';
// const CHECK_URL = 'https://www.horizon.uniorone.ru/check';
function nameToUrl(name: string): string {
  return name.replace(/_/g, '/');
}

const transformImagesData = (data: any[]) => {
  return data.map(image => ({
    ...image,
    nameUrl: nameToUrl(image.name)
  }));
};



const createUrl = (path: string, params?: Record<string, string | number>) => {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
  }
  return url.toString();
};

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}



export const getImagesByFamilyGroupAndSubgroup = async (family: string, group: string, subgroup: string) => {
  const capitalizedFamily = capitalizeFirstLetter(family);
  const capitalizedGroup = capitalizeFirstLetter(group);
  const capitalizedSubgroup = capitalizeFirstLetter(subgroup);
  
  const response = await fetch(createUrl(`/${capitalizedFamily}/${capitalizedGroup}/${capitalizedSubgroup}/`));

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch images. ${errorMessage}`);
  }
  const data = await response.json();
  
  const tID = transformImagesData(data);
  console.log(tID)
  return tID;
};


export const getImageByFilePath = async (filePath: string) => {
  
  const response = await fetch(createUrl(filePath));
  console.log(filePath, '---', response)
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch the image. ${errorMessage}`);
  }
  
  return { file_path: await response.text() }; 
};



export const searchImagesByKeywordAndFamily = async (keyword: string, family?: string) => {
  const params: Record<string, string | number> = { keyword };
  if (family) {
    params.family = family.charAt(0).toUpperCase() + family.slice(1);
  }
  console.log('search',params)

  const response = await fetch(createUrl('/search', params));
  console.log('search',response)

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to search images. ${errorMessage}`);
  }
  const data = await response.json();
  console.log('search',data)

  return transformImagesData(data);
};

export const getLeastUsedImagesByFamily = async (family: string, count = 6) => {
  const capitalizedFamily = capitalizeFirstLetter(family);
  const params: Record<string, string | number> = {
    family: capitalizedFamily,
    count
  };
  console.log('least',params)
  const response = await fetch(createUrl('/least-used', params));
  console.log('least',response)
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch least used images. ${errorMessage}`);
  }
  const data = await response.json();
  console.log('least',data)
  return transformImagesData(data);
};

export const getStaticImageUrl = (filename: string) => {
  return `${BASE_URL}/static/images/${filename}`;
};

export const removeUntilStatic = (input: string): string => {
  const regex = /^.*\/static/;
  return input.replace(regex, '/static');
}

export const replaceInPath = (path: string, substitude: string, item: string): string => {
  return path.replace(substitude, item)
};

export const increaseImageUsage = async (thumbPath: string) => {
  thumbPath = removeUntilStatic(thumbPath)
  console.log('thumbPath',thumbPath)
  try {
    const response = await fetch(`${BASE_URL}/increase-usage${thumbPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to increase image usage. ${errorMessage}`);
    }

    return response

  } catch (error) {
    throw error;
  }
};


export const serverCheck = async (data: { ipAddress: string; uuid: string }) => {
  try {
    console.log('data',data)
    const response = await fetch(CHECK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Use response.json() to read the JSON content of the response body
    const responseBody = await response.json();

    console.log('Данные успешно отправлены на сервер ', responseBody);
    return responseBody;
  } catch (error) {
    console.error('Ошибка при отправке данных на сервер:', error);
    throw error;
  }
};
