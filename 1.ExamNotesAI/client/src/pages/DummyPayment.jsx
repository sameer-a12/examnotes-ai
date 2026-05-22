import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function DummyPayment() {
  const { paymentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [mode, setMode] = useState('credit')
  const [name, setName] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [upi, setUpi] = useState('')
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('form')

  const formatCard = (val) => val.replace(/\D/g,'').substring(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExpiry = (val) => {
    let v = val.replace(/\D/g,'').substring(0,4)
    if(v.length >= 3) v = v.substring(0,2) + ' / ' + v.substring(2)
    return v
  }

  

  const validate = () => {
    const e = {}
    if(mode === 'upi') {
      if(!/^[\w.\-]+@[\w]+$/.test(upi.trim())) e.upi = 'Enter a valid UPI ID (e.g. name@bank)'
    } else {
      if(cardNum.replace(/\s/g,'').length !== 16) e.cardNum = 'Enter a valid 16-digit card number'
      if(!/^\d{2}\s*\/\s*\d{2}$/.test(expiry)) e.expiry = 'Invalid expiry'
      if(cvv.length !== 3) e.cvv = 'Enter 3-digit CVV'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if(!validate()) return
    setStep('processing')
    await new Promise(r => setTimeout(r, 2200))
    try {
      const result = await axios.post(
        serverUrl + `/api/payment/complete/${paymentId}`,
        {},
        { withCredentials: true }
      )
      if(result.data.success) {
        dispatch(setUserData(result.data.user))
        setStep('success')
        setTimeout(() => navigate('/'), 2000)
      }
    } catch(err) {
      console.log(err)
      setStep('form')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden border border-gray-200">


        <div className="bg-[#1a1a2e] px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-lg">⚡</div>
          <div>
            <p className="text-white text-sm font-medium">ExamNotes Pay</p>
            <p className="text-gray-400 text-xs">Secure test gateway</p>
          </div>
          <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
            ₹{new URLSearchParams(window.location.search).get('amount') || '—'}
          </span>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <>
              <div className="flex gap-2 mb-5">
                {['credit','debit','upi'].map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm border transition capitalize
                      ${mode === m ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-gray-200 text-gray-500'}`}>
                    {m === 'upi' ? 'UPI' : m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>

              {mode !== 'upi' ? (
                <>
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-1 block">Cardholder name</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-1 block">Card number</label>
                    <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                    {errors.cardNum && <p className="text-red-500 text-xs mt-1">{errors.cardNum}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Expiry</label>
                      <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM / YY"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">CVV</label>
                      <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').substring(0,3))}
                        placeholder="•••"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label className="text-xs text-gray-500 mb-1 block">UPI ID</label>
                  <input value={upi} onChange={e => setUpi(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                  {errors.upi && <p className="text-red-500 text-xs mt-1">{errors.upi}</p>}
                </div>
              )}

              <button onClick={handlePay}
                className="w-full bg-[#1a1a2e] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
                Pay now
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">🔒 256-bit SSL secured · Test mode</p>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 mb-4">Processing payment...</p>
              <div className="flex justify-center gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <p className="font-medium text-gray-800">Payment successful</p>
              <p className="text-sm text-gray-500 mt-1">Redirecting to home...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DummyPayment