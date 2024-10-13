import { describe, it, expect, beforeAll, beforeEach, afterEach, afterAll } from "vitest";
import { calculateDiscount, canDrive, createProduct, fetchData, getCoupons, isPriceInRange, isStrongPassword, isValidUsername, Stack, validateUserInput } from "../src/core";

describe('getCoupons', () => {
  const result = getCoupons();

   
  it('should confirm the array is not empty ', () => {
    expect(Array.isArray(result)).toBeTruthy()
    expect(result).toBeTruthy();
  })

  it('should return 2 for the length ', () => {
    expect(result.length).toBeGreaterThan(0);
  })

  it('should return an array with valid coupon codes', () => {
    result.forEach(res => {
      expect(res).toHaveProperty('code');
      expect(typeof res.code).toBe('string');
      expect(res.code).toBeTruthy();
    })
  })

  it('should return an array with valid discount', () => {
    result.forEach(res => {
      expect(res).toHaveProperty('discount');
      expect(typeof res.discount).toBe('number');
      expect(res.discount).toBeTruthy();
      expect(res.discount).toBeGreaterThan(0);
      expect(res.discount).toBeLessThan(1)
    })
  })
});

describe('calculateDiscount', () => {

  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9)
    expect(calculateDiscount(10, 'SAVE20')).toBe(8)
    
  });

  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle non-string discount', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle invalid discount', () => {
    expect(calculateDiscount(10, 'SAVE440')).toBe(10);
  })
})


describe('validateUserInput', () => {
  it('should handle non string username', () => {
    expect(validateUserInput(10, 20)).toMatch(/invalid/i);    
  });

  it('should handle username lesser than 3', () => {
    expect(validateUserInput('ad', 20)).toMatch(/invalid/i);    
  });

  it('should handle username greater than 256', () => {
    expect(validateUserInput('d'.repeat(257), 20)).toMatch(/invalid/i);    
  });

  it('should handle non numeric age', () => {
    expect(validateUserInput('Jonny', '20')).toMatch(/invalid/i);    
  });

  it('should handle age lesser than 18', () => {
    expect(validateUserInput('Jonny', 17)).toMatch(/invalid/i);    
  });

  it('should handle age greater than 200', () => {
    expect(validateUserInput('Jonny', 201)).toMatch(/invalid/i);    
  });

  it('should handle correct username and age', () => {
    expect(validateUserInput('Jonny', 30)).toMatch(/successful/i);
  });

  it('should handle both invalid username and age', () => {
    expect(validateUserInput('j', 1)).toMatch(/invalid username/i);
    expect(validateUserInput('j', 1)).toMatch(/invalid age/i);
  })
})


describe('isPriceInRange', () => {

  // parameterized test

  it.each([
    { scenerio: 'price < min', price: -20, min: 0, max: 100, result: false},
    { scenerio: 'price = min', price: 0, min: 0, max: 100, result: true},
    { scenerio: 'price is between min and max', price: 42, min: 0, max: 100, result: true},
    { scenerio: 'price = max', price: 200, min: 0, max: 200, result: true},
    { scenerio: 'price > max', price: 300, min: 0, max: 200, result: false},
  ])('should return $result when $scenerio', ({ result, price, min, max}) => {
    expect(isPriceInRange(price, min, max)).toBe(result)
  })



  // or
  it('should return false when the price is outside the range', () => {
    expect(isPriceInRange(-20, 0, 100)).toBe(false);
    expect(isPriceInRange(300, 0, 200)).toBe(false)
    
  });

  it('should return true when the price is at the min or max', () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(200, 0, 200)).toBe(true)
  });

  it('should return true when the price is within the min and max', () => {
    expect(isPriceInRange(42, 0, 100)).toBe(true);
  })
})

describe('isValidUsername', () => {
  
  it('should return false when the username is outside the minlength and maxlength', () => {
    expect(isValidUsername('w')).toBe(false);
    expect(isValidUsername('w'.repeat(16))).toBe(false)
  });

  it('should return true when the username is at the minlength and maxlength', () => {
    expect(isValidUsername('w'.repeat(5))).toBe(true);
    expect(isValidUsername('w'.repeat(15))).toBe(true)
  });

  it('should return true when the username is within the minlength and maxlength', () => {
    expect(isValidUsername('w'.repeat(8))).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false)
    expect(isValidUsername(3)).toBe(false)
  })
})

describe('canDrive', () => {

  // paramiterized test
  it.each([
    {age: 15, country: 'US', result: false},
    {age: 16, country: 'US', result: true},
    {age: 17, country: 'US', result: true},
    {age: 16, country: 'UK', result: false},
    {age: 17, country: 'UK', result: true},
    {age: 18, country: 'UK', result: true},
  ])('should return $result for $age, $country', ({ age, country, result}) => {
    expect(canDrive(age, country)).toBe(result)
  })

  // or
  
  it('should check for valid country codes', () => {
    expect(canDrive(16, 'USA')).toMatch(/invalid/i)
  });

  it('should return true if given age is equal to the required', () => {
    expect(canDrive(16, 'US')).toBe(true)
    expect(canDrive(17, 'UK')).toBe(true)
  });

  it('should return false if given age is lesser than the required', () => {
    expect(canDrive(15, 'US')).toBe(false)
    expect(canDrive(16, 'UK')).toBe(false)
  });

  it('should return true if given age is greater than the required', () => {
    expect(canDrive(200, 'US')).toBe(true)
    expect(canDrive(200, 'UK')).toBe(true)
  });

  it('should handle invalid age types', () => {
    expect(canDrive('200', 'US')).toBe(false)
    expect(canDrive(null, 'UK')).toBe(false)
    expect(canDrive(undefined, 'UK')).toBe(false)
  })
})


describe('fetchData', () => {
  it('should return a promise that will resolve to an array of numbers', async () => {
    try {
      const result = await fetchData();
      
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error.reason).toMatch(/fail/i);
    }
  })
});


describe('test suite', () => {
  beforeAll(() => {
    console.log('before all');
  })

  beforeEach(() => {
    console.log('before each');
  })

  afterEach(() => {
    console.log('after each');
  })

  afterAll(() => {
    console.log('after all');
  })

  it('test case 1', () => {
    
  });

  it('test case 2', () => {
    
  })
  
})


describe('stack', () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  })

  
  it('should add an item to the array', () => {
    stack.push(1);
    
    expect(stack.size()).toBeGreaterThan(0)
  });

  it('should remove an top item from the array', () => {
    stack.push(1);
    stack.push(2);
    const removedItem = stack.pop();
    
    expect(removedItem).toBe(2);
    expect(stack.size()).toBe(1)
  });

  it('should throw an error when pop is called and the array is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it('should return the top item if peek is called without removing it', () => {
    stack.push(1);
    stack.push(2);

    const peekedItem = stack.peek();
    expect(peekedItem).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it('should throw an error when peek is called and the array is empty', () => {
    expect(() => stack.peek()).toThrow(/empty/i)
  });

  it('should return true when isEmpty is called and the array is empty', () => {
    expect(stack.isEmpty()).toBe(true)
  });

  it('should return false when isEmpty is called and the array is not empty', () => {
    stack.push(1)

    expect(stack.isEmpty()).toBe(false)
  });

  it('should return the size of the array when size is called', () => {
    stack.push(2);
    stack.push(3);

    expect(stack.size()).toBe(2)
  });

  it('should remove all items from the array when clear is called', () => {
    stack.push(1);
    stack.push(2);

    stack.clear();

    expect(stack.size()).toBe(0);
  })
})

describe('createProduct', () => {
  it('should return false for invalid product name', () => {
    const result = createProduct('Jean');

    expect(result.success).toBe(false);
    expect(result.error.code).toMatch(/invalid/i);
    expect(result.error.message).toMatch(/miss/i);
  })
  
  it('should return false for invalid price', () => {
    const result = createProduct({name: 'Jean', price: 'egg'});
    
    expect(result.success).toBe(false)
    expect(result.error.code).toMatch(/invalid/i)
    expect(result.error.message).toMatch(/miss/i);
  })

  it('should return true for successful product created', () => {
    const result = createProduct({name: 'Jean', price: 5});

    expect(result.success).toBe(true)
    expect(result.message).toMatch(/success/i)
  })
})


// describe('isStrongPassword', () => {
//   it('should return false if password length < 8', () => {
//     const result = isStrongPassword('abcd')
//     expect(result.length).toBe(false);
//   })
// })