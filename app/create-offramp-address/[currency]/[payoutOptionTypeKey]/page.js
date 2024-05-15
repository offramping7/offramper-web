import RecipientForm from "@/components/recipients/RecipientForm";
import {fetchPayoutOptionTypeDataByKey} from "@/lib/payoutOptionTypes"
import {fetchBankNamesByCurrency} from "@/lib/banks"
import {fetchBankBinsByCurrency} from "@/lib/bankBins"

const Page = async ({params}) => {
    const {currency,payoutOptionTypeKey} = params
    const lng = 'ru'

    const payoutOptionTypeData = await fetchPayoutOptionTypeDataByKey({payoutOptionTypeKey})
    const {payoutOptionTypeDescriptions,bankSpecificFieldKey,bankSpecificFieldDescriptions,bankNameStrategy} = payoutOptionTypeData
    const payoutOptionTypeDescription = payoutOptionTypeDescriptions[lng]
    const bankSpecificFieldDescription = bankSpecificFieldDescriptions[lng]

    const banks = await fetchBankNamesByCurrency({currency})
    const bankBins = await fetchBankBinsByCurrency({currency})
  return (
    <>
     <h4 className="text-center mt-5 pt-5 text-muted">
          {t("Реквезиты счета на который вы хотели бы вывести деньги")}
          </h4>
    <RecipientForm currency={currency} 
    payoutOptionTypeDescription={payoutOptionTypeDescription}
    bankSpecificFieldKey={bankSpecificFieldKey}
    bankSpecificFieldDescription={bankSpecificFieldDescription}
    bankNameStrategy={bankNameStrategy}
    banks={banks} bankBins={bankBins}/>
     </>
  );
};

export default Page;

const t = (stri) => {
  return stri
}