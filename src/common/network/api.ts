const BASE_URL = 'http://localhost:8080';

// 1. Получение изображений по семейству и группе
export const getImagesByFamilyAndGroup = async (family: string, group: string) => {
  const response = await fetch(`${BASE_URL}/${family}/${group}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch images.');
  }
  return response.json();
};

// 2. Получение изображения по семейству, группе и номеру
export const getImageByFamilyGroupAndNumber = async (family: string, group: string, number: number) => {
  const response = await fetch(`${BASE_URL}/${family}/${group}/${number}`);
  if (!response.ok) {
    throw new Error('Failed to fetch the image.');
  }
  return response.json();
};

// 3. Поиск изображений по ключевому слову и семейству
export const searchImagesByKeywordAndFamily = async (keyword: string, family?: string) => {
  let url = `${BASE_URL}/search?keyword=${keyword}`;
  if (family) {
    url += `&family=${family}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search images.');
  }
  return response.json();
};

// 4. Получение наименее используемых изображений по семейству
export const getLeastUsedImagesByFamily = async (family: string, count = 6) => {
  const response = await fetch(`${BASE_URL}/least-used?family=${family}&count=${count}`);
  if (!response.ok) {
    throw new Error('Failed to fetch least used images.');
  }
  return response.json();
};

// 5. Сервировка статических изображений
// Эта функция может не понадобиться в API, так как это прямая ссылка на изображение. 
// Если вам нужно только получить URL статического изображения, вы можете создать функцию для этого:
export const getStaticImageUrl = (filename: string) => {
  return `${BASE_URL}/static/images/${filename}`;
};
