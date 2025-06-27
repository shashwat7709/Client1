import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const COUNTRIES = ['India'];

const Checkout: React.FC = () => {
  const { cart, getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'India',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pin: '',
    phone: '',
    email: '',
    notes: '',
    shipping: 'free',
    payment: 'card',
    terms: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pin.match(/^\d{6}$/)) newErrors.pin = 'PIN Code must be 6 digits';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) newErrors.email = 'Invalid email';
    if (!formData.terms) newErrors.terms = 'You must accept the terms';
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      // Integrate payment logic here
      navigate('/order-success');
    }
  };

  // Calculate GST (assume 3% for demo)
  const subtotal = getCartTotal();
  const gst = subtotal * 0.03;
  const shipping = formData.shipping === 'express' ? 500 : 0;
  const total = subtotal + gst + shipping;

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-12 flex justify-center items-start">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 animate-fadeIn">
        {/* Billing Details */}
        <Card className="flex-1 min-w-[340px] bg-white">
          <CardHeader>
            <CardTitle className="text-[#46392d] text-2xl">Billing details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First name *</label>
                  <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" />
                  {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last name *</label>
                  <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" />
                  {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company name (optional)</label>
                <Input name="company" value={formData.company} onChange={handleInputChange} placeholder="Company name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country / Region *</label>
                <Select value={formData.country} onValueChange={v => handleSelectChange('country', v)}>
                  <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Street address *</label>
                <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Street address" />
                {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apartment, suite, unit, etc. (optional)</label>
                <Input name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, unit, etc." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Town / City *</label>
                  <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
                  {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State *</label>
                  <Select value={formData.state} onValueChange={v => handleSelectChange('state', v)}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PIN Code *</label>
                  <Input name="pin" value={formData.pin} onChange={handleInputChange} placeholder="6-digit PIN" maxLength={6} />
                  {errors.pin && <span className="text-xs text-red-500">{errors.pin}</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit phone" maxLength={10} />
                {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address *</label>
                <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" />
                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order notes (optional)</label>
                <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notes about your order, e.g. special notes for delivery." />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary & Payment */}
        <div className="flex-1 min-w-[340px] flex flex-col gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#46392d] text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-gray-500 text-center py-8">Your cart is empty</div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-md border" />
                          <div>
                            <div className="font-medium text-[#46392d]">{item.title}</div>
                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-[#46392d]">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4 text-base">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>GST (3%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-4">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Options */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#46392d] text-lg">Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="shipping" value="express" checked={formData.shipping === 'express'} onChange={e => handleSelectChange('shipping', e.target.value)} />
                  <span>Shipping (7-10 days)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#46392d] text-lg">Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="card" checked={formData.payment === 'card'} onChange={e => handleSelectChange('payment', e.target.value)} />
                  <span>Credit Card/Debit Card/NetBanking/UPI</span>
                </label>
                {formData.payment === 'card' && (
                  <div className="mt-2 ml-6">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/Razorpay.png" alt="Razorpay Logo" className="h-8 w-auto" style={{ display: 'inline-block', verticalAlign: 'middle', maxHeight: '32px' }} />
                      <span className="font-semibold text-gray-700 text-lg">Pay by Razorpay</span>
                    </div>
                    <div className="bg-gray-50 border rounded p-4 text-gray-700 text-base">
                      Pay securely by Credit or Debit card or Internet Banking through Razorpay.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Terms and Place Order */}
          <Card className="bg-white">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox id="terms" checked={formData.terms} onCheckedChange={checked => handleSelectChange('terms', !!checked)} />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">I have read and agree to the website terms and conditions</label>
              </div>
              {errors.terms && <span className="text-xs text-red-500">{errors.terms}</span>}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors font-semibold text-lg shadow"
                onClick={handleSubmit}
                disabled={cart.length === 0}
              >
                Place Order
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 