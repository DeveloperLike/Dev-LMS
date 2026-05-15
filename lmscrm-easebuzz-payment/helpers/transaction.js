const { sequelize } = require("../db");
const { QueryTypes } = require("sequelize");

const transactionSaved = async (information) => {

  const {
    lead_id,
    payment_link,
    transaction_id,
    amount,
    status,
    verified_by_id,
    transaction_type,
    degree_applied_for,
    category,
    medium_of_study,
    description,
    created_at,
    last_updated,
    mode,
    package,
    selectedPackages,
    studentInfo
  } = information;

  const t = await sequelize.transaction();

  try {

    const userManagementUserPayload = {
      full_name: studentInfo.find(x => x.code === "full_name")?.value,
      phone: studentInfo.find(x => x.code === "phone")?.value,
      email: studentInfo.find(x => x.code === "email")?.value,
      country_code: studentInfo.find(x => x.code === "country_code")?.value || "+91",
      password: studentInfo.find(x => x.code === "phone")?.value,
      role_id: "1028054e-f82a-4486-aa7c-41d5c448291e", // This role id belongs to Staff
      user_group: "client",
      is_active: true
    };

    const fullName = userManagementUserPayload.full_name || "";
    const nameParts = fullName.split(" ");

    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const username = userManagementUserPayload.phone;

    /* CHECK EXISTING USER */
    const existingUser = await sequelize.query(
      `SELECT username FROM user_management_user WHERE email = :email`,
      {
        replacements: { email: userManagementUserPayload.email },
        type: QueryTypes.SELECT,
        transaction: t
      }
    );

    let userId;

    if (existingUser.length > 0) {
      userId = existingUser[0].username;
    } else {

      const newUser = await sequelize.query(
        `INSERT INTO user_management_user(
          username,
          first_name,
          last_name,
          full_name,
          phone,
          email,
          password,
          is_superuser,
          is_staff,
          is_active,
          date_joined,
          country_code,
          user_group,
          role_id
        )
        VALUES(
          :username,
          :first_name,
          :last_name,
          :full_name,
          :phone,
          :email,
          :password,
          false,
          false,
          true,
          NOW(),
          :country_code,
          :user_group,
          :role_id
        )
        RETURNING username`,
        {
          replacements: {
            username,
            first_name,
            last_name,
            full_name: userManagementUserPayload.full_name,
            phone: userManagementUserPayload.phone,
            email: userManagementUserPayload.email,
            password: userManagementUserPayload.password,
            country_code: userManagementUserPayload.country_code,
            user_group: userManagementUserPayload.user_group,
            role_id: userManagementUserPayload.role_id
          },
          type: QueryTypes.INSERT,
          transaction: t
        }
      );

      userId = newUser[0][0].username;
    }

    /* INSERT */
    await sequelize.query(
      `INSERT INTO accounting_transaction(
        lead_id,
        payment_link,
        transaction_id,
        amount,
        status,
        verified_by_id,
        transaction_type,
        degree_applied_for,
        category,
        medium_of_study,
        description,
        created_at,
        last_updated,
        mode,
        user_id,
        package
      )
      VALUES(
        :lead_id,
        :payment_link,
        :transaction_id,
        :amount,
        :status,
        :verified_by_id,
        :transaction_type,
        :degree_applied_for,
        :category,
        :medium_of_study,
        :description,
        :created_at,
        :last_updated,
        :mode,
        :userId,
        :package
      )`,
      {
        replacements: {
          lead_id,
          payment_link,
          transaction_id,
          amount,
          status,
          verified_by_id,
          transaction_type,
          degree_applied_for,
          category,
          medium_of_study,
          description,
          created_at,
          last_updated,
          mode,
          userId,
          package: JSON.stringify(package)
        },
        transaction: t
      }
    );

    /* PACKAGE INSERT */
    const packagesData = (selectedPackages || []).map(pkg => ({
      lead_id,
      package_id: pkg.id,
      package_name: pkg.name,
      package_amount: pkg.amount,
      package_code: pkg.code,
      gst: pkg.gst,
      sales_person_id: verified_by_id,
      created_at,
      last_updated,
      discount: 0,
      status: true,
      user_id: userId
    }));

    if (packagesData.length) {
      await sequelize.getQueryInterface().bulkInsert(
        "accounting_packagepurchased",
        packagesData,
        { transaction: t }
      );
    }

    await t.commit();

    return { success: true };

  } catch (error) {

    await t.rollback();
    console.error("Transaction save failed:", error);

    return { success: false };
  }
  
};

const transactionsList = async (lead_id) => {
  try {
    const [transactions] = await sequelize.query(
      `
      SELECT 
        at.id,
        at.amount,
        at.created_at,
        at.last_updated,
        at.medium_of_study,
        at.amount_paid_for,
        at.payment_proof,
        at.description,
        at.transaction_id,
        at.transaction_type,
        at.lead_id,
        at.payment_link,
        at.remarks,
        at.mode,
        at.status,
        at.user_id,
        at.verified_by_id,
        at.package,
        at.degree_applied_for,
        at.category,

        umu.full_name as verified_by_name,
        umu.user_group as verified_by_group

      FROM accounting_transaction at
      LEFT JOIN user_management_user umu 
        ON umu.username = at.verified_by_id

      WHERE at.lead_id = :lead_id
      ORDER BY at.created_at DESC
      `,
      {
        replacements: { lead_id },
      }
    );

    return {
      success: true,
      count: transactions.length,
      data: transactions.length ? transactions : [],
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Error fetching transactions",
    };
  }
};

module.exports = { transactionSaved, transactionsList };