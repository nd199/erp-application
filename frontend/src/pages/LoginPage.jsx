import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiLock, FiUser, FiArrowRight } from 'react-icons/fi'
import { authAPI } from '../api/auth'
import { login } from '../store/authSlice'

const schema = Yup.object({
  username: Yup.string().trim().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

function FloatingOrb({ className, delay = 0 }) {
  return (
    <div
      className={`absolute rounded-full blur-[100px] animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] bg-blue-400/40 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await authAPI.login(values)
      dispatch(login(data))
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06060b] relative overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0">
        <FloatingOrb className="w-[500px] h-[500px] bg-blue-600/[0.07] top-[-10%] left-[-5%]" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] bg-violet-600/[0.05] bottom-[-5%] right-[-5%]" delay={2} />
        <FloatingOrb className="w-[300px] h-[300px] bg-cyan-600/[0.04] top-[40%] right-[20%]" delay={4} />
      </div>

      <GridPattern />
      <Particles />

      {/* Horizontal light streak */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className={`w-full max-w-[420px] relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/10 border border-white/[0.08] mb-6 animate-bounce-in relative group">
            <FiLock className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-colors duration-500" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to continue to your workspace</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 glow-blue relative overflow-hidden group">
          {/* Shimmer top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <Formik initialValues={{ username: '', password: '' }} validationSchema={schema} onSubmit={handleSubmit}>
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                {/* Username */}
                <div className={`group/field ${errors.username && touched.username ? 'shake' : ''}`}>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-gray-600 group-focus-within/field:text-blue-400 transition-colors duration-300" />
                    </div>
                    <Field
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)] transition-all duration-300"
                    />
                  </div>
                  <ErrorMessage name="username" component="p" className="text-red-400 text-xs mt-1.5 ml-1" />
                </div>

                {/* Password */}
                <div className="group/field">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center">
                      <FiLock className="w-4 h-4 text-gray-600 group-focus-within/field:text-blue-400 transition-colors duration-300" />
                    </div>
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)] transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                      <FiEye className={`w-4 h-4 transition-all duration-300 ${showPassword ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
                      <FiEyeOff className={`w-4 h-4 absolute transition-all duration-300 ${showPassword ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="text-red-400 text-xs mt-1.5 ml-1" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 disabled:from-blue-600/40 disabled:to-blue-500/40 text-white text-sm font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed disabled:translate-y-0 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-700 tracking-wide">ERP Management System v1.0</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
