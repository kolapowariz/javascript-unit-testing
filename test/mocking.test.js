import { vi, it, expect, describe, beforeEach } from 'vitest'
import { getDiscount, getPriceInCurrency, getShippingInfo, isOnline, login, renderPage, signUp, submitOrder } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics')
vi.mock('../src/libs/payment')
vi.mock('../src/libs/email', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn()
  }
})

describe('test suite', () => {
  
  it('test case', () => {
    const greet = vi.fn();
    greet.mockImplementation( name => 'Hello ' + name);

    const result = greet('Wariz');

    console.log(result)

    expect(greet).toHaveBeenCalledOnce()
  })
})


describe('sendMessage', () => {

  it('should create a mock', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');

    const result = sendText('message');

    expect(sendText).toHaveBeenCalledWith("message");
    expect(result).toMatch(/ok/i)
  })
  
});

describe('getPriceIncurrency', () => {
  
  it('should return price * rate', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5)
    const price = getPriceInCurrency(10, 'NGN');

    expect(price).toBe(15)

  })
})

describe('getShippingInfo', () => {
  
  it('should return shipping unavalaible', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);  
    
    const quote = getShippingInfo('Nigeria');
    console.log(quote);

    expect(quote).toMatch(/unavailable/i)
  })

  it('should return the shipping info and estimated days', () => {
    vi.mocked(getShippingQuote).mockReturnValue({cost: 20, estimatedDays: 2});  
    
    const quote = getShippingInfo('Nigeria');
    console.log(quote);

    expect(quote).toMatch(/20/i);
    expect(quote).toMatch(/2 days/i);

    // or 

    expect(quote).toMatch(/shipping cost: \$20 \(2 days\)/i)
  })
});

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i)
  });

  it('should call analytics', async () => {
    await renderPage()

    expect(trackPageView).toHaveBeenCalledWith('/home')
  })
})

describe('submitOrder', () => {
  const creditCard = {creditCardNumber: '12345'};
  const order = { totalAmount: 3 };
  
  it('should check if the charge function was called with the correct argument', async () => {

    vi.mocked(charge).mockResolvedValue({status: 'success'});

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it('should return failed for if transaction failed', async () => {
    vi.mocked(charge).mockResolvedValue({status: 'failed'});

    const result = await submitOrder(order, creditCard);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/error/i)

    // or 

    expect(result).toEqual( { success: false, error: 'payment_error' })
  });

  it('should return success for if transaction is successful', async () => {
    vi.mocked(charge).mockResolvedValue({status: 'success'});

    const result = await submitOrder(order, creditCard);

    expect(result.success).toBe(true);
    // or 
    expect(result).toEqual( { success: true });
  })
});

describe('signUp', () => {
  const email = 'ade@gmail.com';

  it('should return false if email is not valid', async () => {
    const result = await signUp('a')

    expect(result).toBe(false)
  });

  it('should return true if email is valid', async () => {
    const result = await signUp(email)

    expect(result).toBe(true)
  });

  it('should send welcome email if email is valid', async () => {
    const result = await signUp(email)

    expect(sendEmail).toHaveBeenCalledOnce()
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email)
    expect(args[1]).toMatch(/welcome/i)
  })
});

describe('login', () => {
  it('should email the one time login code', async () => {
    const email = 'ade@gmail.com'
    const spy = vi.spyOn(security, 'generateCode');
    
    await login(email);

    const value = spy.mock.results[0].value.toString();

    expect(sendEmail).toHaveBeenCalledWith(email, value)
    
  })
})

describe('isOnline', () => {
  it('should return false if current hour is outside the opening hour', () => {
    vi.setSystemTime('2024-10-10 07:59')
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-10-10 20:01')
    expect(isOnline()).toBe(false)
  });

  it('should return true if current hour is within the opening hour', () => {
    vi.setSystemTime('2024-10-10 08:01')
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2024-10-10 19:59')
    expect(isOnline()).toBe(true)
  })
})


describe('getDiscount', () => {
  it('should return discount on christmas day', () => {
    vi.setSystemTime('2024-12-25 00:01');
    expect(getDiscount()).toBe(0.2)

    vi.setSystemTime('2024-12-25 23:59');
    expect(getDiscount()).toBe(0.2)
  });

  it('should return no discount on other day', () => {
    vi.setSystemTime('2024-12-26 00:00');
    expect(getDiscount()).toBe(0);

    vi.setSystemTime('2024-12-24 23:59');
    expect(getDiscount()).toBe(0)
  })
})