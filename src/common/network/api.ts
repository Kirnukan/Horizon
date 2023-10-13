const BASE_URL = 'http://localhost:8080';

function nameToUrl(name: string): string {
  return name.replace(/_/g, '/');
}

const transformImagesData = (data: any[]) => {
  return data.map(image => ({
    ...image,
    nameUrl: nameToUrl(image.name)  // Предполагая, что у вас уже есть функция nameToUrl
  }));
};



// Создаем URL на основе параметров
const createUrl = (path: string, params?: Record<string, string | number>) => {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined)  // Исключаем параметры со значением undefined
      .forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
  }
  return url.toString();
};

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}



// 1. Получение изображений по семейству и группе
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


// 2. Получение изображения по семейству, группе и номеру
export const getImageByFilePath = async (filePath: string) => {
  
  const response = await fetch(createUrl(filePath));
  console.log(filePath, '---', response)
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch the image. ${errorMessage}`);
  }
  
  // Всегда обрабатываем ответ как текст
  return { file_path: await response.text() }; 
};



// 3. Поиск изображений по ключевому слову и семейству
export const searchImagesByKeywordAndFamily = async (keyword: string, family?: string) => {
  const params: Record<string, string | number> = { keyword };
  if (family) {
    params.family = family;
  }
  const response = await fetch(createUrl('/search', params));
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to search images. ${errorMessage}`);
  }
  const data = await response.json();
  return transformImagesData(data);
};

// 4. Получение наименее используемых изображений по семейству
export const getLeastUsedImagesByFamily = async (family: string, count = 6) => {
  const capitalizedFamily = capitalizeFirstLetter(family);
  const response = await fetch(createUrl('/least-used', { capitalizedFamily, count }));
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch least used images. ${errorMessage}`);
  }
  const data = await response.json();
  return transformImagesData(data);
};

// 5. Сервировка статических изображений
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
    // console.log(`Sending POST request to: ${BASE_URL}/increase-usage${thumbPath}`);
    // console.log('About to fetch:', `${BASE_URL}/increase-usage${thumbPath}`);
    // console.log('Using fetch function:', fetch.toString());
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
