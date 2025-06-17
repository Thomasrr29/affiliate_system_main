from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from src.assets.services import AssetsService
from .enums import BonusType, AssetType
from fastapi import HTTPException
from datetime import datetime

BONUS_DATA_REQUIREMENTS = {
    BonusType.SALE: {"amount"}, 
    BonusType.STREAK: {"name", "days"},
    BonusType.AFFILIATE: {"amount", "sale_id"},
    BonusType.ACHIEVEMENT: {"name", "level"}
}

class BonusCalculator: 

    ##THIS CLASS ENCAPSULATE ALL THE CALCULATIONS FOR THE BONUS SYSTEM
    @staticmethod
    def calculate_sale_bonus(data: Dict[str, Any]) -> float: 

        amount = data.get("amount", 0)
        return int(amount * 0.1) 
    
    @staticmethod
    def calculate_streak_bonus(data: Dict[str, Any]) -> float: 

        streak = data.get("days", 0)
        return int(streak * 5)
    
    @staticmethod
    def calculate_affiliate_bonus(data: Dict[str, Any]) -> float: 

        referrals = data.get("amount", 0)
        return int(referrals * 0.05)
    
    @staticmethod
    def calculate_achievement_bonus(data: Dict[str, Any]) -> float: 

        achievements = data.get("level", 1)
        return int(achievements * 10)
    
    CALCULATORS = {
        BonusType.SALE: calculate_sale_bonus,
        BonusType.STREAK: calculate_streak_bonus,
        BonusType.AFFILIATE: calculate_affiliate_bonus,
        BonusType.ACHIEVEMENT: calculate_achievement_bonus
    }

    @classmethod
    def calculate(cls, bonus_type: BonusType, data: Dict[str, Any]):

        calculator = cls.CALCULATORS.get(bonus_type)

        if not calculator:
            raise ValueError(f"Unknown bonus type: {bonus_type}")
        
        return calculator(data)
    
    @classmethod
    def get_description(cls, bonus_type: BonusType, data: Dict[str, Any]) -> str: 

        descriptions = {
            BonusType.SALE: f"Sale {data.get('sale_id', 'N/A')} for {data.get('amount', 0)} shop",
            BonusType.STREAK: f"Streak {data.get('days', 0)} of {data.get('days', 0)} days.",
            BonusType.AFFILIATE: f"Affiliate bonus of sale {data.get('sale_id', "N/A")} for {data.get('amount', 0)}",
            BonusType.ACHIEVEMENT: f"Achievement {data.get('name', '.....')} for {data.get('level', 'N/A')}"
        }

        return descriptions.get(bonus_type, "Points Bonus")
    
class BonusService: 
        
        @staticmethod
        def validate_bonus_data(bonus_type: BonusType, data: Dict[str, Any]) -> None : 

            if bonus_type not in BONUS_DATA_REQUIREMENTS.keys():
                raise HTTPException(status_code=400, detail=f"Invalid bonus type: {bonus_type}")
            
            required_data = BONUS_DATA_REQUIREMENTS[bonus_type]
            data_keys = set(data.keys())
            missing_keys = required_data - data_keys

            if missing_keys:
                raise HTTPException(status_code=400, detail=f"Missing data for bonus type {bonus_type}: {', '.join(missing_keys)}")

        @staticmethod
        async def apply_bonus(
            db: AsyncSession,
            wallet_id: int,
            asset_type: AssetType,
            bonus_type: BonusType,
            data: Dict[str, Any]
        ): 
            
            #In base of the bonus type and data we apply the transaction and bonus in the balance
            try: 
              
                BonusService.validate_bonus_data(bonus_type, data)
  
                bonus_amount = BonusCalculator.calculate(bonus_type=bonus_type, data=data)

                description = BonusCalculator.get_description(bonus_type=bonus_type, data=data) 

                result  = await AssetsService.apply_transaction_and_update_balance(
                    db=db,
                    wallet_id=wallet_id,
                    asset_type=asset_type,
                    amount=bonus_amount,
                    category='IN', ###CHANGE THE CATEGORY,
                    description=description,
                    reference_id=data.get('sale_id', None) ###MANAGE THE REFERENCE ID IN OTHER CASES 
                )

                return {
                    "success": True,
                    "bonus_amount": bonus_amount,
                    "new_balance": result["new_balance"],
                    "transaction_id": result["transaction_id"],
                    "bonus_type": bonus_type.value,
                    "description": description
                }
                    
            except HTTPException as e:
                raise HTTPException(status_code=500, detail=f"Error applying bonus: {str(e)}")
            
            except ValueError as e: 
                raise HTTPException(status_code=400, detail=str(e))
            
            except Exception as e: 
                raise HTTPException(
                    status_code=500,
                    detail=f"Error aplying {bonus_type.value} bonus {str(e)}"
                )