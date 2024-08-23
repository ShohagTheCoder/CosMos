"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

function UserProfile() {
    const { id } = useParams();

    return (
        <main>
            <div className="container mx-auto">
                <div className="grid grid-cols-3 py-3">
                    <div className="col-span-1 border p-3">
                        <div className="grid grid-cols-2">
                            <div className="col-span-1">1</div>
                            <div className="col-span-1">1</div>
                        </div>
                    </div>
                    <div className="col-span-2 border p-3">
                        <div className="grid grid-cols-2">
                            <div className="col-span-1">
                                <Link href="/accounts">Send money</Link>
                            </div>
                            <div className="col-span-1">2</div>
                            <div className="col-span-1">3</div>
                            <div className="col-span-1">4</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto">{id}</div>
        </main>
    );
}

export default UserProfile;
