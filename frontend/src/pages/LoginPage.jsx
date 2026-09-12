import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../api/auth'
import { login } from '../store/authSlice'
import { FiUser, FiLock } from 'react-icons/fi'

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!username.trim() || !password.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const { data } = await authAPI.login({ username, password })
            dispatch(login(data))
            toast.success('Welcome back!')
            navigate('/')
        } catch (err) {
            const message = err.response?.data?.message || 'Invalid username or password'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md mx-4">
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500" />

                    <div className="px-8 py-10">
                        {/* Logo / Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">ERP System</h1>
                            <p className="text-white/50 text-sm">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder-white/30 rounded-xl border border-white/15 bg-white/5 backdrop-blur-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                        placeholder="Enter username"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder-white/30 rounded-xl border border-white/15 bg-white/5 backdrop-blur-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 text-sm font-semibold text-white rounded-xl border border-blue-500/40 bg-blue-500/20 hover:bg-blue-500/30 hover:border-blue-500/60 transition-all duration-200 shadow-[0_0_15px_rgba(59,130,246,0.15)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
