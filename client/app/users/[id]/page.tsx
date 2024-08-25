"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

function UserProfile() {
    const { id } = useParams();

    return (
        <main>
            <div className="container mx-auto">
                <div className="grid grid-cols-5 py-3 gap-3">
                    <div className="col-span-2 border p-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-1">
                                <img src="/profile-picture.jpg" alt="" />
                            </div>
                            <div className="col-span-1">
                                <p>Id: {id}</p>
                                <p>Name: Shohag Ahmed</p>
                                <p>Address: Bancharampur</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 border p-3">
                        <div className="grid grid-cols-2 gap-y-3">
                            <div className="col-span-1">
                                <p>Balance: 230tk</p>
                            </div>
                            <div className="col-span-1">Sells: 3667tk</div>
                            <div className="col-span-1">View account</div>
                            <div className="col-span-1">
                                <Link
                                    href="/accounts"
                                    className="py-2 px-3 bg-blue-700"
                                >
                                    Send money
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto">
                <div className="row">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Veritatis quasi quidem asperiores pariatur aperiam
                        praesentium omnis. Quia vitae deserunt omnis.
                    </p>
                </div>
                <div className="row">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Veritatis quasi quidem asperiores pariatur aperiam
                        praesentium omnis. Quia vitae deserunt omnis.
                    </p>
                </div>
                <div className="row">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Veritatis quasi quidem asperiores pariatur aperiam
                        praesentium omnis. Quia vitae deserunt omnis.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default UserProfile;
