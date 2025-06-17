import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { registerUser } from '../api/auth';
import dayjs from 'dayjs';
import styled from 'styled-components';
import MapboxAutocomplete from '../components/AutoComplete';

const RegisterWrapper = styled.div`
  height: 100vh;
  background: url('/login_background.png') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', 'Open Sans', sans-serif;
`;

const RegisterBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  border-radius: 24px;
  border: 1px solid rgba(123, 124, 124, 0.2);
  width: 450px;
  color: white;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  img {
    width: 64px;
    height: 64px;
  }

  h1 {
    margin: 0.5rem 0 0;
    font-size: 1.4rem;
    font-weight: bold;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: .5rem;
`;

const Row = styled.div`
  display: flex;
  gap: .8rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #1e1e1e;
  color: white;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #007bff, #00c2ff);
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const BackLink = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #cccccc;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.div`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
`;

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        birthday: '',
        address: '',
        agency: '',
        position: '',
        email: '',
        contact: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setForm({ ...form, [field]: value });

        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, value),
        }));
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'firstName':
            case 'lastName':
            case 'address':
            case 'agency':
            case 'position':
                return value.trim() === '' ? 'This field is required.' : '';
            case 'birthday':
                return value ? '' : 'Birthday is required.';
            case 'email':
                return /^\S+@\S+\.\S+$/.test(value) ? '' : 'Invalid email address.';
            case 'contact':
                return /^[0-9]{10,15}$/.test(value) ? '' : 'Invalid contact number.';
            case 'password':
                return value.length >= 6 ? '' : 'Password must be at least 6 characters.';
            case 'confirmPassword':
                return value === form.password ? '' : 'Passwords do not match.';
            default:
                return '';
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const newErrors = {};
        for (const field in form) {
            const error = validateField(field, form[field]);
            if (error) newErrors[field] = error;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await registerUser(form);
                alert('Registration successful! Awaiting admin approval.');
                navigate('/login');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <RegisterWrapper>
            <RegisterBox>
                <Logo>
                    <img src="/pagasa-logo.png" alt="PAGASA Logo" />
                    <h1>PAGASA</h1>
                    <p>Request an Account</p>
                </Logo>
                <Form onSubmit={handleRegister}>
                    <Row>
                        <div style={{ flex: 1 }}>
                            <Input placeholder="First Name" value={form.firstName} onChange={handleChange('firstName')} />
                            {errors.firstName && <ErrorMsg>{errors.firstName}</ErrorMsg>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input placeholder="Last Name" value={form.lastName} onChange={handleChange('lastName')} />
                            {errors.lastName && <ErrorMsg>{errors.lastName}</ErrorMsg>}
                        </div>
                    </Row>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Birthday"
                            value={form.birthday ? dayjs(form.birthday) : null}
                            onChange={(newValue) => {
                                const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : '';
                                setForm((prev) => ({ ...prev, birthday: formattedDate }));
                                setErrors((prev) => ({
                                    ...prev,
                                    birthday: validateField('birthday', formattedDate),
                                }));
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'filled',
                                    InputProps: {
                                        disableUnderline: true,
                                        style: {
                                            backgroundColor: '#1e1e1e',
                                            borderRadius: 6,
                                            paddingLeft: 2,
                                            color: 'white',
                                            height: '48px',
                                        },
                                    },
                                    InputLabelProps: {
                                        style: {
                                            color: '#aaa',
                                        },
                                    },
                                    sx: {
                                        mb: '0.5rem',
                                        '& .MuiFilledInput-root': {
                                            backgroundColor: '#1e1e1e',
                                            color: 'white',
                                            borderRadius: 1,
                                        },
                                        '& .MuiFilledInput-input': {
                                            color: 'white',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: '#a0a0a0', // White calendar icon
                                        },
                                    },
                                },
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [120, 2], // [x, y] shift — move right 50px and down 10px
                                            },
                                        },
                                    ],
                                },
                            }}
                        />
                    </LocalizationProvider>
                    {errors.birthday && <ErrorMsg>{errors.birthday}</ErrorMsg>}

                    <div style={{ position: 'relative', marginBottom: '.5rem', width: '95%' }}>
                        <MapboxAutocomplete
                            value={form.address}
                            onChange={(e) => {
                                handleChange('address')(e);
                            }}
                            onSelect={(val) => {
                                setForm(prev => ({ ...prev, address: val }));
                                setErrors(prev => ({ ...prev, address: '' }));
                            }}
                        />
                        {errors.address && <ErrorMsg>{errors.address}</ErrorMsg>}
                    </div>

                    <Row>
                        <div style={{ flex: 1 }}>
                            <Input placeholder="Agency" value={form.agency} onChange={handleChange('agency')} />
                            {errors.agency && <ErrorMsg>{errors.agency}</ErrorMsg>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input placeholder="Position" value={form.position} onChange={handleChange('position')} />
                            {errors.position && <ErrorMsg>{errors.position}</ErrorMsg>}
                        </div>
                    </Row>

                    <Row>
                        <div style={{ flex: 1 }}>
                            <Input type="email" placeholder="Email Address" value={form.email} onChange={handleChange('email')} />
                            {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input placeholder="Contact Number" value={form.contact} onChange={handleChange('contact')} />
                            {errors.contact && <ErrorMsg>{errors.contact}</ErrorMsg>}
                        </div>
                    </Row>

                    <Row>
                        <div style={{ flex: 1 }}>
                            <Input type="password" placeholder="Password" value={form.password} onChange={handleChange('password')} />
                            {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                            />
                            {errors.confirmPassword && <ErrorMsg>{errors.confirmPassword}</ErrorMsg>}
                        </div>
                    </Row>

                    <Button type="submit">Submit Request</Button>
                    <BackLink onClick={() => navigate('/login')}>
                        Already have an account? Back to Login
                    </BackLink>
                </Form>
            </RegisterBox>
        </RegisterWrapper>
    );
};

export default Register;
