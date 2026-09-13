import { Field, ErrorMessage } from 'formik'

function FormField({ name, label, type = 'text', placeholder, options, as = 'input', rows = 3 }) {
  return (
    <div className="group/field">
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </label>

      {as === 'select' ? (
        <Field
          name={name}
          as="select"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none focus:border-blue-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)] transition-all duration-300 appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">Select {label}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">
              {opt.label}
            </option>
          ))}
        </Field>
      ) : as === 'textarea' ? (
        <Field
          name={name}
          as="textarea"
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)] transition-all duration-300 resize-none"
        />
      ) : (
        <Field
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)] transition-all duration-300"
        />
      )}

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-400 text-xs mt-1.5 ml-1"
      />
    </div>
  )
}

export default FormField
