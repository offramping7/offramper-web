import { fetchAvailablePayoutOptionTypesByCurrency } from "@/lib/payoutOptionTypes";
import Link from "next/link";

const Page = async ({ params }) => {
  const lng = "ru";
  const { currency } = params;
  const payoutOptionTypes = await fetchAvailablePayoutOptionTypesByCurrency({
    currency,
  }); //should return full docs
  

  //here you render the 3 payout option types available as white buttons
  return (
    <>

      {payoutOptionTypes.map((payoutOptionType) => {
        return (
          <div className="row shadow rounded bg-white py-3 my-3 px-5 w-50 mx-auto">
            <div className="text-center">

  <Link
            key={payoutOptionType.payoutOptionTypeKey}
            href={`/create-offramp-address/${currency}/${payoutOptionType.payoutOptionTypeKey}`}
          >
            {/* {JSON.stringify(payoutOptionType)} */}
            {payoutOptionType.payoutOptionTypeDescription[lng]}
          </Link>
          </div>

          </div>
        
        );
      })}
    </>
  );
};

export default Page;
