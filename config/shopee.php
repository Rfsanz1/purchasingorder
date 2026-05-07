<?php

return [

    'managers' => [
        'AMSManager' => [
            'label' => 'AMS Manager',
            'icon' => 'key',
            'methods' => [
                'getAccessToken'   => 'Get Access Token',
                'refreshAccessToken' => 'Refresh Access Token',
                'getShopInfo'      => 'Get Shop Info',
            ],
        ],
        'ProductManager' => [
            'label' => 'Product Manager',
            'icon' => 'box',
            'methods' => [
                'getItemList'   => 'Get Item List',
                'getItemDetail' => 'Get Item Detail',
                'addItem'       => 'Add Item',
                'updateItem'    => 'Update Item',
                'updatePrice'   => 'Update Price',
                'updateStock'   => 'Update Stock',
                'deleteItem'    => 'Delete Item',
                'getCategory'   => 'Get Category',
            ],
        ],
        'GlobalProductManager' => [
            'label' => 'Global Product Manager',
            'icon' => 'globe',
            'methods' => [
                'getGlobalItemList'   => 'Get Global Item List',
                'getGlobalItemDetail' => 'Get Global Item Detail',
                'addGlobalItem'       => 'Add Global Item',
                'updateGlobalItem'    => 'Update Global Item',
            ],
        ],
        'VideoManager' => [
            'label' => 'Video Manager',
            'icon' => 'video',
            'methods' => [
                'uploadVideo'  => 'Upload Video',
                'getVideoInfo' => 'Get Video Info',
                'deleteVideo'  => 'Delete Video',
            ],
        ],
        'ShopManager' => [
            'label' => 'Shop Manager',
            'icon' => 'store',
            'methods' => [
                'getShopInfo'        => 'Get Shop Info',
                'getShopProfile'     => 'Get Shop Profile',
                'updateShopProfile'  => 'Update Shop Profile',
                'getShopPerformance' => 'Get Shop Performance',
            ],
        ],
        'OrderManager' => [
            'label' => 'Order Manager',
            'icon' => 'clipboard',
            'methods' => [
                'getOrderList'             => 'Get Order List',
                'getOrderDetail'           => 'Get Order Detail',
                'cancelOrder'              => 'Cancel Order',
                'getOrderLogistics'        => 'Get Order Logistics',
                'handleBuyerCancellation'  => 'Handle Buyer Cancellation',
                'setNoteToOrder'           => 'Set Note to Order',
            ],
        ],
        'LogisticsManager' => [
            'label' => 'Logistics Manager',
            'icon' => 'truck',
            'methods' => [
                'getLogisticInfo'      => 'Get Logistic Info',
                'initLogistic'         => 'Init Logistic',
                'getTrackingInfo'      => 'Get Tracking Info',
                'updateShippingOrder'  => 'Update Shipping Order',
                'getDeliveryAddress'   => 'Get Delivery Address',
            ],
        ],
        'PaymentManager' => [
            'label' => 'Payment Manager',
            'icon' => 'credit-card',
            'methods' => [
                'getPayoutDetail'       => 'Get Payout Detail',
                'getEscrowDetail'       => 'Get Escrow Detail',
                'getWalletTransactions' => 'Get Wallet Transactions',
            ],
        ],
        'DiscountManager' => [
            'label' => 'Discount Manager',
            'icon' => 'tag',
            'methods' => [
                'getDiscountList'  => 'Get Discount List',
                'addDiscount'      => 'Add Discount',
                'deleteDiscount'   => 'Delete Discount',
                'updateDiscount'   => 'Update Discount',
                'getDiscountItem'  => 'Get Discount Item',
            ],
        ],
        'VoucherManager' => [
            'label' => 'Voucher Manager',
            'icon' => 'ticket',
            'methods' => [
                'getVoucherList'   => 'Get Voucher List',
                'addVoucher'       => 'Add Voucher',
                'updateVoucher'    => 'Update Voucher',
                'deleteVoucher'    => 'Delete Voucher',
                'getVoucherDetail' => 'Get Voucher Detail',
            ],
        ],
        'AdsManager' => [
            'label' => 'Ads Manager',
            'icon' => 'megaphone',
            'methods' => [
                'createManualProductAds' => 'Create Manual Product Ads',
                'getCampaignList'        => 'Get Campaign List',
                'getCampaignPerformance' => 'Get Campaign Performance',
                'updateCampaign'         => 'Update Campaign',
                'getAdList'              => 'Get Ad List',
            ],
        ],
        'LivestreamManager' => [
            'label' => 'Livestream Manager',
            'icon' => 'broadcast',
            'methods' => [
                'getSessions'      => 'Get Sessions',
                'createSession'    => 'Create Session',
                'startSession'     => 'Start Session',
                'endSession'       => 'End Session',
                'getLivestreamData' => 'Get Livestream Data',
            ],
        ],
        'ReturnsManager' => [
            'label' => 'Returns Manager',
            'icon' => 'return',
            'methods' => [
                'getReturnList'   => 'Get Return List',
                'getReturnDetail' => 'Get Return Detail',
                'disputeReturn'   => 'Dispute Return',
                'confirmReturn'   => 'Confirm Return',
                'acceptReturn'    => 'Accept Return',
            ],
        ],
        'AccountHealthManager' => [
            'label' => 'Account Health Manager',
            'icon' => 'shield',
            'methods' => [
                'getAccountHealthInfo' => 'Get Account Health Info',
                'getShopPenaltyInfo'   => 'Get Shop Penalty Info',
                'getBanStatus'         => 'Get Ban Status',
            ],
        ],
    ],

];
