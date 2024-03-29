import Image from 'next/image'
import Link from 'next/link'

import ticketPic from '/public/icons/white/ticket.svg'
import rekeningPic from '/public/icons/white/rekening.svg'
import searchPic from '/public/icons/white/search.svg'
import accountPic from '/public/icons/white/person.svg'

import styles from './bottomNavigation.module.css'

export default function BottomNavigation() {
    return (
        <nav className={styles['bottom-navigation']}>
            <ul>
                <li>
                    <Link href={`bill`}>
                        <Image
                            src={rekeningPic}
                            alt='Bill'
                        />
                        Bill
                    </Link>
                </li>
                <li>
                    <Link href={`ticket`}>
                        <Image
                            src={ticketPic}
                            alt='ticket'
                        />
                        Ticket
                    </Link>
                </li>
                <li>
                    <Link href={`search`}>
                        <Image
                            src={searchPic}
                            alt='search glass'
                        />
                        Search
                    </Link>
                </li>
                <li>
                    <Link href={`account`}>
                        <Image
                            src={accountPic}
                            alt='account'
                        />
                        Account
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
