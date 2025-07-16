import React from "react";

export function UserPage() {
    return(
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                <div
                    className=" bg-gradient-to-br from-blue-400 to-blue-800 absolute inset-0 -z-10 w-full h-full object-cover object-right md:object-center"
                />

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                            Store
                        </h2>
                        <p className="mt-8 text-lg font-medium leading-7 text-gray-300 sm:text-xl sm:leading-8">
                            Store Description
                        </p>
                    </div>

                    <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                            <a href="#">Open<span aria-hidden="true">&rarr;</span></a>
                            <a href="#">Open<span aria-hidden="true">&rarr;</span></a>
                            <a href="#">Open<span aria-hidden="true">&rarr;</span></a>
                            <a href="#">Open<span aria-hidden="true">&rarr;</span></a>
                        </div>
                        <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col-reverse gap-1">
                                <dt className="text-base leading-7 text-gray-300">Offices worldwide</dt>
                                <dd className="text-4xl font-semibold tracking-tight text-white">12</dd>
                            </div>
                            <div className="flex flex-col-reverse gap-1">
                                <dt className="text-base leading-7 text-gray-300">Full-time colleagues</dt>
                                <dd className="text-4xl font-semibold tracking-tight text-white">300+</dd>
                            </div>
                            <div className="flex flex-col-reverse gap-1">
                                <dt className="text-base leading-7 text-gray-300">Hours per week</dt>
                                <dd className="text-4xl font-semibold tracking-tight text-white">40</dd>
                            </div>
                            <div className="flex flex-col-reverse gap-1">
                                <dt className="text-base leading-7 text-gray-300">Paid time off</dt>
                                <dd className="text-4xl font-semibold tracking-tight text-white">Unlimited</dd>
                            </div>
                        </dl>
                    </div>
                    <button className="bg-indigo-600 px-10 py-3 rounded-lg">
                        <a className="text-zinc-50" href="/user">User</a>
                    </button>
                </div>
            </div>
    )
}