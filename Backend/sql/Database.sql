CREATE TABLE `root` (
    `id` int(11) NOT NULL,
    `username` varchar(20) NOT NULL,
    `password` varchar(40) NOT NULL,
    `mpin` int(4) NOT NULL,
    `Yearly_fee` int(11) NOT NULL,
    `Monthly_fee` int(11) NOT NULL,
    `Renew_fee` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = MyISAM DEFAULT CHARSET = latin1;

INSERT INTO
    root
VALUES
    (
        "0",
        "foo",
        "foo",
        "YOUR_MPIN",
        "2500",
        "1500",
        "1500"
    );

CREATE TABLE `users` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `ImageURI` varchar(24) DEFAULT NULL,
    `Name` varchar(50) DEFAULT NULL,
    `MobileNumber` varchar(10) DEFAULT NULL,
    `Gender` varchar(4) DEFAULT NULL,
    `Fee` varchar(5) DEFAULT NULL,
    `Frequancy` varchar(4) DEFAULT NULL,
    `PaymentStatus` varchar(4) DEFAULT NULL,
    `BatchCode` varchar(10) NOT NULL,
    `Date` date DEFAULT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `ImageURI_UNIQUE` (`ImageURI`)
) ENGINE = InnoDB AUTO_INCREMENT = 10454 DEFAULT CHARSET = latin1;