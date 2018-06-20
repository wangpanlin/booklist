const Service = require('egg').Service;

class PurchaseService extends Service {
	async addPurchase(courseID){
		const {app,ctx} = this;
		const uInfo = await ctx.service.user.find({
			id: app.userId
		});
		const courseInfo = await ctx.service.course.selectByID(courseID);
		let status = 0;
		if(uInfo.credit >= courseInfo.price){
			
			const result = await app.mysql.update("user", {
				id: app.userId,
				credit: uInfo.credit - courseInfo.price
			});
			if(result.affectedRows === 1){
				const result = await app.mysql.insert("purchase",{
					course_id: courseID,
					user_id: app.userId
				});
				if(result.affectedRows === 1){
					status = 1;
				}
			}	
		}
		return status;
	}

	async selectMyPurchase(){
		const {app, ctx} = this;
		const result = await app.mysql.query('select c.id,c.title from course as c left join purchase as p on c.id=p.course_id where p.user_id='+app.userId+';');
		return result;
	}

	async selectPurchaseAboutMe(){
		const {app, ctx} = this;
		const result = await app.mysql.query('select c.price,p.user_id,p.add_time from purchase as p left join course as c on c.id=p.course_id where p.course_id IN (select course_id from purchase where course_id IN (select id from course where user_id='+app.userId+')) OR p.user_id='+app.userId+' ORDER BY p.add_time;');
		
		// 修改result字段，user_id 属性去除，user_id 为自身则是购买类型 0，不是自身则被订购类型 1
		if(result.length > 0){
			for(let i in result){
				if(result[i].user_id == app.userId)
					result[i]['type'] = 0;
				else
					result[i]['type'] = 1;
				delete result[i]['user_id'];
			}
		}
		return result;
	}
}

module.exports = PurchaseService;