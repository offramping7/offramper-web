import RecipientForm from "@/components/recipients/RecipientForm";
import {fetchPayoutOptionTypeDataByKey} from "@/lib/payoutOptionTypes"
import {fetchBankNamesByCurrency} from "@/lib/banks"
import {fetchBankBinsByCurrency} from "@/lib/bankBins"
import {fetchTranslations} from "@/lib/translations"
import { PT_Sans} from 'next/font/google'
const ptSans = PT_Sans({weight:"400",style:["normal"],subsets:["latin","cyrillic"]})


const Page = async ({params}) => {
    const {currency,payoutOptionTypeKey,lng} = params
    const translationJson = await fetchTranslations({lng})
    const t = (str) => {
      return translationJson[str] || str
    }

    const payoutOptionTypeData = await fetchPayoutOptionTypeDataByKey({payoutOptionTypeKey})
    const {payoutOptionTypeDescriptions,bankSpecificFieldKey,bankSpecificFieldDescriptions,bankNameStrategy} = payoutOptionTypeData
    const payoutOptionTypeDescription = payoutOptionTypeDescriptions[lng]
    const bankSpecificFieldDescription = bankSpecificFieldDescriptions[lng]

    const banks = await fetchBankNamesByCurrency({currency})
    const bankBins = await fetchBankBinsByCurrency({currency})
  return (
    <>
    <div className={ptSans.className}>
    <h4 className="text-center mt-5 pt-5 text-muted">
          {t("createOfframpAddress.requisites")}
          </h4>
    <RecipientForm currency={currency} 
    payoutOptionTypeDescription={payoutOptionTypeDescription}
    bankSpecificFieldKey={bankSpecificFieldKey}
    bankSpecificFieldDescription={bankSpecificFieldDescription}
    bankNameStrategy={bankNameStrategy}
    banks={banks} bankBins={bankBins} translationJson={translationJson}/>
    </div>
    
     </>
  );
};

export default Page;

const t = (stri) => {
  return stri
}