import { fetchAvailablePayoutOptionTypesByCurrency } from "@/lib/payoutOptionTypes";
import { fetchTranslations } from "@/lib/translations";
import {fetchBankNamesByCurrency} from "@/lib/banks"
import {fetchBankBinsByCurrency} from "@/lib/bankBins"
import CreateOfframpAddressMain from "@/components/recipients/CreateOfframpAddressMain"
import { PT_Sans} from 'next/font/google'
const ptSans = PT_Sans({weight:"400",style:["normal"],subsets:["latin","cyrillic"]})



const Page = async ({ params }) => {
  const { currency, lng } = params;
  const translationJson = await fetchTranslations({ lng });
  const t = (str) => {
    return translationJson[str] || str;
  };
  const payoutOptionTypes = await fetchAvailablePayoutOptionTypesByCurrency({
    currency,
  }); //should return full docs
  const banks = await fetchBankNamesByCurrency({currency})
    const bankBins = await fetchBankBinsByCurrency({currency})

  return (
    <>
        <div className="row">
          {/* <div className="col-1"> </div> */}
          <div className={`col-12 ${ptSans.className}`}>
            <h4 className={`text-center mt-5 pt-5 text-muted`}>
              {t("createOfframpAddress.requisites")}
            </h4>
           
            <CreateOfframpAddressMain bankBins={bankBins} banks={banks} payoutOptionTypes={payoutOptionTypes} translationJson={translationJson} currency={currency} lng={lng} />
          </div>
          {/* <div className="col-1"> </div> */}
        </div>
    </>
  );
};

export default Page;
