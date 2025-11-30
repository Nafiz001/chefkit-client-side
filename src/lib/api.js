const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// User API
export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const getUserByEmail = async (email) => {
  const response = await fetch(`${API_URL}/users/${email}`);
  return response.json();
};

// Meal Kits API
export const getMealKits = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.cuisine && filters.cuisine !== 'All') {
    params.append('cuisine', filters.cuisine);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.sort) {
    params.append('sort', filters.sort);
  }
  
  const url = `${API_URL}/meal-kits${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  return response.json();
};

export const getMealKitById = async (id) => {
  const response = await fetch(`${API_URL}/meal-kits/${id}`);
  if (!response.ok) {
    throw new Error('Meal kit not found');
  }
  return response.json();
};

export const createMealKit = async (mealKitData) => {
  const response = await fetch(`${API_URL}/meal-kits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mealKitData),
  });
  return response.json();
};

export const updateMealKit = async (id, mealKitData) => {
  const response = await fetch(`${API_URL}/meal-kits/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mealKitData),
  });
  return response.json();
};

export const deleteMealKit = async (id) => {
  const response = await fetch(`${API_URL}/meal-kits/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const getMyMealKits = async (email) => {
  const response = await fetch(`${API_URL}/my-meal-kits/${email}`);
  return response.json();
};

// Reviews API
export const getReviews = async (mealKitId) => {
  const response = await fetch(`${API_URL}/reviews/${mealKitId}`);
  return response.json();
};

export const createReview = async (reviewData) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  return response.json();
};

export const deleteReview = async (id) => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
