'use client';
import HeaderComponent from '@/components/common/HeaderComponent';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { PiSealCheck } from 'react-icons/pi';
import { SlLayers } from 'react-icons/sl';
const Feedback = (): JSX.Element => {
  return (
    <>
      <HeaderComponent
        rightElements={[
          <Link key="feedback" href="/feedback" className={styles.box}>
            <PiSealCheck />
          </Link>,
          <Link key="about" href="/about" className={styles.box}>
            <SlLayers />
          </Link>,
        ]}
      />
      <main>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">
                대한 민국 보건소 위치 지도 서비스 피드백
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                본 서비스에 대한 피드백을 남겨주세요.
              </p>
            </div>

            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 mx-auto">
                <div className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      Feedback Input
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <section className="text-gray-600 body-font relative">
                      <div className="container px-5 mx-auto">
                        <div className="lg:w-1/2 md:w-2/3 mx-auto">
                          <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="name"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-1/2">
                              <div className="relative">
                                <label
                                  htmlFor="email"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <div className="relative">
                                <label
                                  htmlFor="message"
                                  className="leading-7 text-sm text-gray-600"
                                >
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  name="message"
                                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                              </div>
                            </div>
                            <div className="p-2 w-full">
                              <button
                                onClick={() => {}}
                                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                  <div className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <span className="font-semibold title-font text-gray-700">
                        CATEGORY
                      </span>
                      <span className="mt-1 text-gray-500 text-sm">
                        12 Jun 2019
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                        Bitters hashtag waistcoat fashion axe chia unicorn
                      </h2>
                      <p className="leading-relaxed">
                        Glossier echo park pug, church-key sartorial biodiesel
                        vexillologist pop-up snackwave ramps cornhole. Marfa 3
                        wolf moon party messenger bag selfies, poke vaporware
                        kombucha lumbersexual pork belly polaroid hoodie
                        portland craft beer.
                      </p>
                      <a className="text-indigo-500 inline-flex items-center mt-4">
                        Delete
                      </a>
                    </div>
                  </div>
                  <div className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <span className="font-semibold title-font text-gray-700">
                        CATEGORY
                      </span>
                      <span className="mt-1 text-gray-500 text-sm">
                        12 Jun 2019
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                        Meditation bushwick direct trade taxidermy shaman
                      </h2>
                      <p className="leading-relaxed">
                        Glossier echo park pug, church-key sartorial biodiesel
                        vexillologist pop-up snackwave ramps cornhole. Marfa 3
                        wolf moon party messenger bag selfies, poke vaporware
                        kombucha lumbersexual pork belly polaroid hoodie
                        portland craft beer.
                      </p>
                      <a className="text-indigo-500 inline-flex items-center mt-4">
                        Delete
                      </a>
                    </div>
                  </div>
                  <div className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                      <span className="font-semibold title-font text-gray-700">
                        CATEGORY
                      </span>
                      <span className="text-sm text-gray-500">12 Jun 2019</span>
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                        Woke master cleanse drinking vinegar salvia
                      </h2>
                      <p className="leading-relaxed">
                        Glossier echo park pug, church-key sartorial biodiesel
                        vexillologist pop-up snackwave ramps cornhole. Marfa 3
                        wolf moon party messenger bag selfies, poke vaporware
                        kombucha lumbersexual pork belly polaroid hoodie
                        portland craft beer.
                      </p>
                      <a className="text-indigo-500 inline-flex items-center mt-4">
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Feedback;
