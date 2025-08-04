import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtp, verifyOtp, signup } from '../features/auth/authSlice';
import { Button, Input } from '@shadcn/ui';

export default function Signup() {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullname:'', email:'', password:'' });

  const handleSendOtp = () => {
    dispatch(sendOtp(phone)).then(() => setStep(2));
  };
  const handleVerify = () => {
    dispatch(verifyOtp({ phone, otp }))
      .unwrap()
      .then(() => setStep(3));
  };
  const handleSignup = () => {
    dispatch(signup({ ...form, phone, password: form.password }))
      .unwrap()
      .then(() => alert('Signed up!'));
  };

  return (
    <div className="form">
      {step === 1 && (
        <>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <Button onClick={handleSendOtp}>Send OTP</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Input value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" />
          <Button onClick={handleVerify}>Verify OTP</Button>
        </>
      )}
      {step === 3 && (
        <>
          <Input value={form.fullname} onChange={e=>setForm({...form, fullname:e.target.value})} placeholder="Full Name"/>
          <Input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email"/>
          <Input value={form.password} type="password" placeholder="Password"
                 onChange={e=>setForm({...form, password:e.target.value})}/>
          <Button onClick={handleSignup}>Sign Up</Button>
        </>
      )}
    </div>
  );
}
