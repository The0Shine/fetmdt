
import { useState } from "react"
import { Check, X, Truck, CreditCard, Package, AlertTriangle } from "lucide-react"

interface OrderProcessingProps {
  orderId: string
  currentStatus: "pending" | "processing" | "completed" | "cancelled"
  onStatusChange: (status: "pending" | "processing" | "completed" | "cancelled") => void
}

export default function OrderProcessing({ orderId, currentStatus, onStatusChange }: OrderProcessingProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionType, setActionType] = useState<"confirm" | "cancel" | "ship" | "complete" | null>(null)

  const handleAction = (type: "confirm" | "cancel" | "ship" | "complete") => {
    setActionType(type)
    setShowConfirm(true)
  }

  const confirmAction = () => {
    switch (actionType) {
      case "confirm":
        onStatusChange("processing")
        break
      case "cancel":
        onStatusChange("cancelled")
        break
      case "ship":
        // Trong thực tế, đây là nơi bạn sẽ cập nhật trạng thái vận chuyển
        break
      case "complete":
        onStatusChange("completed")
        break
    }
    setShowConfirm(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Xử lý đơn hàng #{orderId}</h2>

      <div className="flex items-center mb-6">
        <div className="w-full">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div
                className={`flex flex-col items-center ${
                  currentStatus === "pending" || currentStatus === "processing" || currentStatus === "completed"
                    ? "text-teal-500"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStatus === "pending" || currentStatus === "processing" || currentStatus === "completed"
                      ? "bg-teal-100"
                      : "bg-gray-100"
                  }`}
                >
                  <CreditCard size={20} />
                </div>
                <span className="text-xs mt-1">Đặt hàng</span>
              </div>

              <div
                className={`flex flex-col items-center ${
                  currentStatus === "processing" || currentStatus === "completed" ? "text-teal-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStatus === "processing" || currentStatus === "completed" ? "bg-teal-100" : "bg-gray-100"
                  }`}
                >
                  <Package size={20} />
                </div>
                <span className="text-xs mt-1">Xử lý</span>
              </div>

              <div
                className={`flex flex-col items-center ${
                  currentStatus === "completed" ? "text-teal-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStatus === "completed" ? "bg-teal-100" : "bg-gray-100"
                  }`}
                >
                  <Truck size={20} />
                </div>
                <span className="text-xs mt-1">Giao hàng</span>
              </div>

              <div
                className={`flex flex-col items-center ${
                  currentStatus === "completed" ? "text-teal-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStatus === "completed" ? "bg-teal-100" : "bg-gray-100"
                  }`}
                >
                  <Check size={20} />
                </div>
                <span className="text-xs mt-1">Hoàn thành</span>
              </div>

              {currentStatus === "cancelled" && (
                <div className="flex flex-col items-center text-red-500">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X size={20} />
                  </div>
                  <span className="text-xs mt-1">Đã hủy</span>
                </div>
              )}
            </div>

            <div className="absolute top-5 left-0 right-0 flex-1 h-1 bg-gray-200 -z-10">
              <div
                className={`h-full bg-teal-500 transition-all duration-300 ${
                  currentStatus === "pending"
                    ? "w-0"
                    : currentStatus === "processing"
                      ? "w-1/3"
                      : currentStatus === "completed"
                        ? "w-full"
                        : "w-0"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {currentStatus === "pending" && (
          <>
            <button
              onClick={() => handleAction("confirm")}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 flex items-center"
            >
              <Check size={16} className="mr-1" /> Xác nhận đơn hàng
            </button>
            <button
              onClick={() => handleAction("cancel")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <X size={16} className="mr-1" /> Hủy đơn hàng
            </button>
          </>
        )}

        {currentStatus === "processing" && (
          <>
            <button
              onClick={() => handleAction("ship")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <Truck size={16} className="mr-1" /> Giao hàng
            </button>
            <button
              onClick={() => handleAction("complete")}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 flex items-center"
            >
              <Check size={16} className="mr-1" /> Hoàn thành đơn hàng
            </button>
            <button
              onClick={() => handleAction("cancel")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <X size={16} className="mr-1" /> Hủy đơn hàng
            </button>
          </>
        )}

        {currentStatus === "completed" && (
          <div className="flex items-center text-green-500">
            <Check size={16} className="mr-1" /> Đơn hàng đã hoàn thành
          </div>
        )}

        {currentStatus === "cancelled" && (
          <div className="flex items-center text-red-500">
            <AlertTriangle size={16} className="mr-1" /> Đơn hàng đã bị hủy
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-4">Xác nhận thao tác</h3>
            <p className="text-gray-700 mb-4">
              {actionType === "confirm"
                ? "Bạn có chắc chắn muốn xác nhận đơn hàng này không?"
                : actionType === "cancel"
                  ? "Bạn có chắc chắn muốn hủy đơn hàng này không?"
                  : actionType === "ship"
                    ? "Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái giao hàng không?"
                    : "Bạn có chắc chắn muốn hoàn thành đơn hàng này không?"}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button onClick={confirmAction} className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
