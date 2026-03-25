import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { base } from "../../../redux/services/api";
import toast from "react-hot-toast";

const ProcessingPayment = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id"); 
  
  useEffect(() => {
    if (!orderId) return;

    const poll = async () => {
      try {
        const res = await fetch(`${base}/vendor/payment-status?order_id=${orderId}`);
        const data = await res.json();
        // console.log("verify-data",data);
        if(data?.status==="failed"){
             window.location.href = "/payment-failed"
        }
        if (data.status === "paid") {
          window.location.href = "/payment-success";
        }
      } catch (err) {
        toast.error(err?.message??"Something went wrong.")
        // console.error("Error checking payment status:", err);
      }
    };

    const intervalId = setInterval(poll, 3000);
    return () => clearInterval(intervalId);
  }, [orderId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Processing payment...</h3>
    </div>
  );
};

export default ProcessingPayment;
