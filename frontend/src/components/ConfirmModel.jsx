
const ConfirmModel = ({ isOpen, title, message, onConfirm, onCancel }) => {

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />
            <div className="relative bg-white rounded-lg p-2 shadow-xl w-full max-w-sm mx-4">
                <div className=" w-full h-full border rounded border-black">
                    <div className="w-full h-full p-2 bg-gray-500 flex justify-between items-center">
                        <h2 className="text-lg text-white font-semibold mb-2">{title}</h2>
                    </div>
                    <div className="p-2">
                        <p className="text-gray-600">{message}</p>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 
                            text-sm text-white bg-red-600 rounded-md hover:bg-red-700
                            hover:cursor-pointer"
                            >
                                Delete
                            </button>
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-400 hover:cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModel