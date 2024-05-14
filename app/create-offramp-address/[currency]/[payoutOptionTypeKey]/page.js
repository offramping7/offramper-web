import RecipientForm from "@/components/recipients/RecipientForm";
import {fetchPayoutOptionTypeDataByKey} from "@/lib/payoutOptionTypes"
import {fetchBanksByCurrency} from "@/lib/banks"
import {fetchBankBinsByCurrency} from "@/lib/bankBins"

const Page = async ({params}) => {
    const {currency,payoutOptionTypeKey} = params
    const payoutOptionTypeData = await fetchPayoutOptionTypeDataByKey({payoutOptionTypeKey})
    const banks = await fetchBanksByCurrency({currency})
    const bankBins = await fetchBankBinsByCurrency({currency})
    const lng = 'ru'




  //here you render the 3 payout option types available as white buttons
  return (
    <>
    <RecipientForm lng={lng} currency={currency} payoutOptionTypeData={payoutOptionTypeData} banks={banks} bankBins={bankBins}/>
     </>
  );
};

export default Page;
