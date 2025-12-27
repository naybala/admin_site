<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="close"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-bold text-gray-800">
          គោលការណ៍ភាពឯកជន (Privacy Policy)
        </h2>
        <button
          @click="close"
          class="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div class="space-y-6">
          <!-- Effective Date -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="font-semibold">
              មានប្រសិទ្ធភាពចាប់ពីថ្ងៃទី: [24-10-2025]
            </p>
            <p class="font-semibold">
              បានធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: [24-10-2025]
            </p>
          </div>

          <!-- 1. Introduction -->
          <section>
            <h3 class="text-lg font-semibold mb-2">១. ការណែនាំ</h3>
            <p class="text-gray-700 mb-2">
              សូមស្វាគមន៍មកកាន់
              <strong
                >វេទិកាអចលនទ្រព្យឌីជីថល បាយ័ន (BAYON Digital Real Estate
                Platform)</strong
              >
              ("<strong>វេទិកាបាយ័ន</strong>", "<strong
                >កម្មវិធីបាយ័ន APP</strong
              >", "<strong>យើងខ្ញុំ</strong>", "<strong>របស់យើង</strong>" ឬ
              "<strong>ក្រុមហ៊ុនយើង</strong>")។
            </p>
            <p class="text-gray-700 mb-2">
              គោលការណ៍នេះពន្យល់ពីរបៀបដែលយើងប្រមូល ប្រើ ចែករំលែក
              និងការពារព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក នៅពេលអ្នកប្រើប្រាស់គេហទំព័រ
              កម្មវិធីទូរស័ព្ទ ឬសេវាផ្សេងៗដែលទាក់ទង
              ("<strong>សេវាកម្ម</strong>")។
            </p>
            <p class="text-gray-700 mb-2">
              <strong>កម្មវិធីបាយ័ន APP</strong> ត្រូវបានអភិវឌ្ឍន៍
              និងគ្រប់គ្រងដោយ
              <strong>ក្រុមហ៊ុន ប៊ីកសូហ្វថ៍ (BIGSOFT TECHNOLOGY PLC)</strong>
              ដែលបានចុះបញ្ជីត្រឹមត្រូវនៅក្នុង
              <strong>ព្រះរាជាណាចក្រកម្ពុជា</strong>។
            </p>
            <p class="text-gray-700 mb-2">
              <strong>បាយ័ន APP មិនមែនជាក្រុមហ៊ុនអចលនទ្រព្យទេ។</strong><br />
              យើង <strong>មិនទិញ មិនលក់ ឬជួលអចលនទ្រព្យដោយផ្ទាល់</strong> និង
              <strong
                >មិនប្រកួតប្រជែងជាមួយភ្នាក់ងារ ឬស្ថាប័នអចលនទ្រព្យណាមួយទេ</strong
              >។
            </p>
            <p class="text-gray-700 mb-2">
              បំណងរបស់យើងគឺជាការផ្តល់ជំនួយផ្នែកបច្ចេកវិទ្យា ដើម្បី
              <strong>បម្លែងការងារដោយដៃឲ្យទៅជាប្រព័ន្ធឌីជីថល</strong> ហើយ
              <strong>គាំទ្រភាគីទាំងអស់ក្នុងវិស័យអចលនទ្រព្យ</strong>
              រួមមានភ្នាក់ងារ ស្ថាប័ន អ្នកទិញ អ្នកលក់
              និងសមាគមឲ្យទទួលបានភាពជោគជ័យក្នុងអាជីវកម្មរបស់ពួកគេ។
            </p>
            <p class="text-gray-700">
              ដោយប្រើប្រាស់កម្មវិធីបាយ័ន អ្នកយល់ព្រមនឹងគោលការណ៍នេះ។
              ប្រសិនបើអ្នកមិនយល់ព្រម សូមបញ្ឈប់ការប្រើប្រាស់ភ្លាមៗ។
            </p>
          </section>

          <!-- 2. Platform Description and Fee Structure -->
          <section>
            <h3 class="text-lg font-semibold mb-2">
              ២. ការពិពណ៌នាវេទិកា និងតម្លៃសេវា
            </h3>

            <h4 class="font-medium mb-2">២.១ សេវាឥតគិតថ្លៃ</h4>
            <p class="text-gray-700 mb-3">
              បាយ័នផ្តល់សេវាឥតគិតថ្លៃសម្រាប់អ្នកប្រើទូទៅ ដើម្បី៖
            </p>
            <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
              <li>រុករក និងស្វែងរកអចលនទ្រព្យ</li>
              <li>
                ប្រកាសអចលនទ្រព្យបាន <strong>៥ បញ្ចូល (Free 5 Posts)</strong>
              </li>
              <li>ទាក់ទងភ្នាក់ងារ ឬម្ចាស់អចលនទ្រព្យដោយផ្ទាល់</li>
            </ul>
            <p class="text-gray-700 mb-4">
              យើង
              <strong>មិនយកកម្រៃជើងសារ ឬគណនាថ្លៃគណនេយ្យណាមួយ</strong>
              ពេលអ្នកប្រកាស ឬលក់អចលនទ្រព្យតាមបាយ័នទេ។
            </p>

            <h4 class="font-medium mb-2">
              ២.២ សេវាជាសមាជិកប្រចាំខែ (Subscription Services)
            </h4>
            <p class="text-gray-700 mb-3">
              សម្រាប់
              <strong>ភ្នាក់ងារ អង្គភាព និងសមាគមអចលនទ្រព្យ</strong>
              បាយ័នផ្តល់សេវាបង់ថ្លៃប្រចាំខែ ដែលរួមមានលក្ខណៈពិសេសដូចជា៖
            </p>
            <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
              <li>ប្រកាសអចលនទ្រព្យបានគ្មានកំណត់</li>
              <li>ប្រព័ន្ធគ្រប់គ្រងអតិថិជន (CRM System)</li>
              <li>របាយការណ៍ប្រសិទ្ធភាពភ្នាក់ងារ និងសូចនាករ KPI</li>
              <li>គណនីក្រុមហ៊ុន និងការគ្រប់គ្រងក្រុមការងារ</li>
              <li>ប្រព័ន្ធគ្រប់គ្រងសមាជិកសមាគមអចលនទ្រព្យ</li>
              <li>បង្ហាញអចលនទ្រព្យមានអាទិភាពក្នុងការស្វែងរក</li>
            </ul>

            <h4 class="font-medium mb-2">២.៣ វិធីបង់ប្រាក់ដែលគាំទ្រ</h4>
            <p class="text-gray-700 mb-3">
              ដើម្បីធានាបាននូវប្រតិបត្តិការដែលមានសុវត្ថិភាព និងងាយស្រួល
              យើងគាំទ្រវិធីបង់ប្រាក់ដូចជា៖
            </p>
            <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
              <li><strong>ABA Pay</strong></li>
              <li><strong>KHQR</strong></li>
              <li><strong>VISA Card</strong></li>
              <li><strong>MasterCard</strong></li>
              <li><strong>WeChat Pay</strong></li>
              <li><strong>Alipay</strong></li>
            </ul>
            <p class="text-gray-700 mb-4">
              ការទូទាត់ទាំងអស់ត្រូវបានធ្វើឡើងតាមប្រព័ន្ធបង់ប្រាក់មានសុវត្ថិភាព
              និងការអ៊ិនគ្រីប (Encryption) ដើម្បីការពារទិន្នន័យរបស់អ្នក។
            </p>

            <h4 class="font-medium mb-2">២.៤ ថ្លៃសេវា និងការសងប្រាក់វិញ</h4>
            <ul class="list-disc pl-5 text-gray-700 space-y-1">
              <li>
                អ្នកប្រើសាមញ្ញអាចប្រកាសអចលនទ្រព្យបាន
                <strong>៥ បញ្ចូលឥតគិតថ្លៃ</strong>
              </li>
              <li>សមាជិកប្រចាំខែត្រូវបង់ថ្លៃប្រចាំខែ ឬប្រចាំឆ្នាំ</li>
              <li>តម្លៃនឹងបង្ហាញច្បាស់មុនពេលអ្នកបញ្ជាក់ការទូទាត់</li>
              <li>
                ការទូទាត់ទាំងអស់គឺ <strong>មិនអាចសងប្រាក់វិញបានទេ</strong>,
                លើកលែងតែមានបញ្ហាបច្ចេកទេស ឬតាមច្បាប់កម្ពុជា
              </li>
            </ul>
          </section>

          <!-- 3. Information We Collect -->
          <section>
            <h3 class="text-lg font-semibold mb-2">៣. ព័ត៌មានដែលយើងប្រមូល</h3>

            <h4 class="font-medium mb-2">៣.១ ព័ត៌មានដែលអ្នកផ្តល់ឱ្យ</h4>
            <ul class="list-disc pl-5 mb-4 text-gray-700 space-y-1">
              <li>ឈ្មោះ លេខទូរស័ព្ទ និងអ៊ីមែល</li>
              <li>ព័ត៌មានគណនី និងពាក្យសម្ងាត់</li>
              <li>ព័ត៌មានភ្នាក់ងារ ឬសមាគម (បើមាន)</li>
              <li>រូបភាព និងព័ត៌មានអចលនទ្រព្យដែលបានប្រកាស</li>
              <li>ព័ត៌មានបង់ប្រាក់ និងវិក្កយបត្រ</li>
              <li>សារផ្ញើ សំណូមពរ ឬមតិប្រតិកម្ម</li>
            </ul>

            <h4 class="font-medium mb-2">៣.២ ព័ត៌មានប្រមូលដោយស្វ័យប្រវត្តិ</h4>
            <ul class="list-disc pl-5 mb-4 text-gray-700 space-y-1">
              <li>អាសយដ្ឋាន IP ប្រភេទឧបករណ៍ និងប្រព័ន្ធប្រតិបត្តិការ</li>
              <li>ទិន្នន័យប្រើប្រាស់ និងស្ថិតិគេហទំព័រ</li>
              <li>Cookies និង session data</li>
              <li>ទិន្នន័យទីតាំង (បើអ្នកអនុញ្ញាត)</li>
            </ul>

            <h4 class="font-medium mb-2">៣.៣ ព័ត៌មានពីភាគីទីបី</h4>
            <p class="text-gray-700">
              យើងអាចទទួលព័ត៌មានពីសមាជិកសហការណ៍ សមាគម ឬប្រព័ន្ធបង់ប្រាក់
              ដើម្បីផ្ទៀងផ្ទាត់ ឬធ្វើឲ្យគណនីរបស់អ្នកប្រសើរឡើង។
            </p>
          </section>

          <!-- 4. How We Use Information -->
          <section>
            <h3 class="text-lg font-semibold mb-2">
              ៤. របៀបយើងប្រើប្រាស់ព័ត៌មាន
            </h3>
            <p class="text-gray-700 mb-2">យើងប្រើព័ត៌មានរបស់អ្នកដើម្បី៖</p>
            <ul class="list-disc pl-5 text-gray-700 space-y-1">
              <li>ផ្តល់ និងបង្កើនប្រសិទ្ធភាពសេវាបាយ័ន</li>
              <li>ធ្វើឲ្យមានប្រតិបត្តិការប្រកាស និងស្វែងរកអចលនទ្រព្យ</li>
              <li>គ្រប់គ្រងគណនី និងការទូទាត់</li>
              <li>ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ និងការអនុលោមតាមច្បាប់</li>
              <li>ផ្ញើព័ត៌មាន ឬសារផ្សព្វផ្សាយ (ដោយមានការយល់ព្រម)</li>
              <li>
                គាំទ្រភ្នាក់ងារ ស្ថាប័ន និងសមាគមក្នុងការប្រើប្រព័ន្ធឌីជីថល
              </li>
              <li>បំពេញតាមតម្រូវការច្បាប់កម្ពុជា</li>
            </ul>
          </section>

          <!-- 5. Information Sharing -->
          <section>
            <h3 class="text-lg font-semibold mb-2">៥. ការចែករំលែកព័ត៌មាន</h3>
            <p class="text-gray-700 mb-2">
              យើងអាចចែករំលែកព័ត៌មានរបស់អ្នកនៅក្នុងករណី៖
            </p>
            <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
              <li>
                <strong>ជាមួយអ្នកប្រើផ្សេងទៀត:</strong> ព័ត៌មានប្រវត្តិ
                ឬការប្រកាសដែលអ្នកបង្ហាញសាធារណៈ
              </li>
              <li>
                <strong>ជាមួយស្ថាប័ន ឬសមាគម:</strong> សម្រាប់ការផ្ទៀងផ្ទាត់
                ឬគ្រប់គ្រងសមាជិក
              </li>
              <li>
                <strong>ជាមួយអ្នកផ្តល់សេវាបង់ប្រាក់:</strong>
                ដើម្បីបំពេញប្រតិបត្តិការបង់ប្រាក់
              </li>
              <li>
                <strong>តាមច្បាប់:</strong> ប្រសិនបើតម្រូវដោយអាជ្ញាធររដ្ឋ
                ឬតុលាការ
              </li>
            </ul>
            <p class="text-gray-700">
              យើង
              <strong>មិនលក់ ឬជួលព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក</strong>
              ទៅភាគីទីបីឡើយ។
            </p>
          </section>

          <!-- 6. Data Retention -->
          <section>
            <h3 class="text-lg font-semibold mb-2">៦. ការរក្សាទុកទិន្នន័យ</h3>
            <p class="text-gray-700 mb-2">
              យើងរក្សាទុកព័ត៌មានរបស់អ្នកចំណុចដែលគណនីរបស់អ្នកនៅសកម្ម
              ឬតាមតម្រូវការច្បាប់។
            </p>
            <p class="text-gray-700">
              អ្នកអាចស្នើសុំលុបគណនី និងទិន្នន័យរបស់អ្នកបានគ្រប់ពេល
              តាមការទាក់ទងមកក្រុមជំនួយរបស់យើង។
            </p>
          </section>

          <!-- 7. Data Security -->
          <section>
            <h3 class="text-lg font-semibold mb-2">៧. សុវត្ថិភាពទិន្នន័យ</h3>
            <p class="text-gray-700 mb-2">
              យើងយកចិត្តទុកដាក់ខ្ពស់ចំពោះសុវត្ថិភាពទិន្នន័យ និងភាពឯកជនរបស់អ្នក។
            </p>
            <p class="text-gray-700 mb-2">
              យើងបានអនុវត្តវិធានការបច្ចេកទេសដូចជា៖
            </p>
            <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
              <li>ម៉ាស៊ីនមេមានសុវត្ថិភាព និង firewall</li>
              <li>ការអ៊ិនគ្រីប (Encryption) ទិន្នន័យពេលបញ្ជូន</li>
              <li>ការចូលដំណើរការដែលបានកំណត់សិទ្ធិ</li>
              <li>
                <strong>ការបម្រុងទុកទិន្នន័យប្រចាំថ្ងៃ (Daily Backup)</strong>
                ដើម្បីការពារព័ត៌មានពីការខូចខាត ឬបាត់បង់
              </li>
              <li>ប្រព័ន្ធស្ដារទិន្នន័យឡើងវិញក្នុងករណីបញ្ហាបច្ចេកទេស</li>
            </ul>
            <p class="text-gray-700 mb-2">
              សម្រាប់ <strong>អ្នកប្រើប្រាស់ប្រភេទ Premium</strong>,
              យើងអនុញ្ញាតឲ្យអ្នក
              <strong
                >ទាញយក និងបម្រុងទុកទិន្នន័យដោយខ្លួនឯងជារូបមន្ត Excel
                (.xlsx)</strong
              >
              ដើម្បីរក្សាទុក
              ឬគ្រប់គ្រងទិន្នន័យអាជីវកម្មរបស់ខ្លួនបានយ៉ាងងាយស្រួល។
            </p>
            <p class="text-gray-700">
              ទិន្នន័យទាក់ទងនឹងការទូទាត់ទាំងអស់ត្រូវបានការពារតាមស្តង់ដារ
              <strong>PCI-DSS</strong> និងបទបញ្ញត្តិអន្តរជាតិ។
            </p>
          </section>

          <!-- 8. Your Rights -->
          <section>
            <h3 class="text-lg font-semibold mb-2">៨. សិទ្ធិរបស់អ្នក</h3>
            <p class="text-gray-700 mb-2">អ្នកមានសិទ្ធិ៖</p>
            <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
              <li>ពិនិត្យ និងកែប្រែព័ត៌មានផ្ទាល់ខ្លួន</li>
              <li>ស្នើសុំលុបគណនី</li>
              <li>បដិសេធការផ្ញើសារផ្សព្វផ្សាយ</li>
              <li>ទាមទារទិន្នន័យរបស់អ្នកជាច្បាប់ចម្លង</li>
            </ul>
            <p class="text-gray-700">
              សូមទាក់ទងក្រុមជំនួយរបស់យើងសម្រាប់សំណើទាំងនេះ។
            </p>
          </section>

          <!-- 9. Cookies -->
          <section>
            <h3 class="text-lg font-semibold mb-2">
              ៩. ការប្រើប្រាស់ Cookies និងការតាមដាន
            </h3>
            <p class="text-gray-700">
              យើងប្រើ Cookies ដើម្បីធ្វើឲ្យបទពិសោធន៍អ្នកប្រើប្រសើរឡើង
              និងរក្សាការកំណត់ចំណូលចិត្ត។ អ្នកអាចបិទ Cookies
              តាមការកំណត់កម្មវិធីរុករក
              ប៉ុន្តែមុខងារមួយចំនួនអាចមិនដំណើរការត្រឹមត្រូវ។
            </p>
          </section>

          <!-- 10. Children's Privacy -->
          <section>
            <h3 class="text-lg font-semibold mb-2">១០. ភាពឯកជនសម្រាប់កុមារ</h3>
            <p class="text-gray-700">
              បាយ័ន APP មិនមានបំណងផ្តល់សេវា សម្រាប់
              <strong>មនុស្សអាយុក្រោម ១៨ ឆ្នាំ</strong> ទេ។
              យើងមិនប្រមូលទិន្នន័យពីកុមារដោយចេតនា។
            </p>
          </section>

          <!-- 11. International Data Transfer -->
          <section>
            <h3 class="text-lg font-semibold mb-2">
              ១១. ការផ្ទេរទិន្នន័យអន្តរជាតិ
            </h3>
            <p class="text-gray-700">
              ទិន្នន័យរបស់អ្នកអាចត្រូវបានដំណើរការឬរក្សាទុកលើម៉ាស៊ីនមេនៅក្រៅប្រទេសកម្ពុជា
              ដើម្បីបង្កើនសមត្ថភាពប្រព័ន្ធ។ យើងធានាថា
              ទិន្នន័យរបស់អ្នកនឹងត្រូវបានការពារដោយវិធានសុវត្ថិភាពសមរម្យ។
            </p>
          </section>

          <!-- 12. Policy Changes -->
          <section>
            <h3 class="text-lg font-semibold mb-2">
              ១២. ការផ្លាស់ប្តូរកោលការណ៍នេះ
            </h3>
            <p class="text-gray-700">
              យើងអាចធ្វើបច្ចុប្បន្នភាពគោលការណ៍នេះពេលណាក៏បាន។
              ការផ្លាស់ប្តូរទាំងអស់នឹងត្រូវប្រកាសនៅលើវេទិកា
              និងបង្ហាញកាលបរិច្ឆេទថ្មី។
              ការបន្តប្រើប្រាស់បាយ័នបន្ទាប់ពីមានការផ្លាស់ប្តូរ មានន័យថា
              អ្នកយល់ព្រមនឹងលក្ខខណ្ឌថ្មី។
            </p>
          </section>

          <!-- 13. Contact Information -->
          <section>
            <h3 class="text-lg font-semibold mb-2">១៣. ទាក់ទងមកយើង</h3>
            <p class="text-gray-700 mb-2">
              សម្រាប់សំណួរ ឬសំណើទាក់ទងនឹងគោលការណ៍នេះ សូមទាក់ទង៖
            </p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-700">
                <strong
                  >ក្រុមហ៊ុន ប៊ីកសូហ្វថ៍ បច្ចេកវិទ្យា អេភីអែលស៊ី (BIGSOFT
                  TECHNOLOGY PLC)</strong
                ><br />
                អ្នកអភិវឌ្ឍន៍វេទិកា
                <strong>BAYON Digital Real Estate Platform</strong><br />
                📍 ភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា<br />
                📧 <strong>អ៊ីមែល:</strong> support@bigsoft.tech<br />
                🌐 <strong>គេហទំព័រ:</strong> https://www.bayonapp.com
              </p>
            </div>
          </section>
        </div>
      </div>

      <!-- Footer with Accept Checkbox -->
      <div class="flex justify-between items-center p-4 border-t bg-gray-50">
        <div class="flex items-center">
          <input
            v-model="accepted"
            type="checkbox"
            id="privacyAccept"
            class="w-4 h-4 text-brand-primary bg-gray-100 border-gray-300 rounded focus:ring-brand-primary focus:ring-2"
          />
          <label for="privacyAccept" class="ml-2 text-sm text-gray-700">
            I have read and accept the Privacy Policy
          </label>
        </div>
        <div class="flex space-x-3">
          <button
            @click="close"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            @click="accept"
            :disabled="!accepted"
            class="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Define props
interface Props {
  show: boolean;
}

// Define emits
interface Emits {
  (e: "update:show", value: boolean): void;
  (e: "close"): void;
  (e: "accept"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

// Reactive data
const accepted = ref(true);

// Methods
const close = () => {
  emit("update:show", false);
  emit("close");
};

const accept = () => {
  if (accepted.value) {
    emit("update:show", false);
    emit("accept");
  }
};
</script>

<style scoped>
/* Add any specific styles for the modal here */
</style>
